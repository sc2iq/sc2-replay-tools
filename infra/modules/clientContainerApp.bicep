param name string = '${resourceGroup().name}-replay-analyzer-client'
param location string = resourceGroup().location
param tags object = {}

param managedEnvironmentResourceId string

param imageName string
param containerName string

param registryUsername string
@secure()
param registryPassword string

@secure()
param storageConnectionString string
param storageContainerNameUnprocessed string
param storageContainerNameProcessed string

var registryPassworldSecretName = 'container-registry-password'
var storageConnectionStringSecretName = 'storage-connection-string'

resource containerApp 'Microsoft.App/containerapps@2022-03-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    managedEnvironmentId: managedEnvironmentResourceId
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 8080
      }
      registries: [
        {
          server: '${registryUsername}.azurecr.io'
          username: registryUsername
          passwordSecretRef: registryPassworldSecretName
        }
      ]
      secrets: [
        {
          name: registryPassworldSecretName
          value: registryPassword
        }
        {
          name: storageConnectionStringSecretName
          value: storageConnectionString
        }
      ]
    }
    template: {
      containers: [
        {
          image: imageName
          name: containerName
          // https://learn.microsoft.com/en-us/azure/container-apps/containers#configuration
          resources: {
            cpu: any('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'STORAGE_ACCOUNT_CONNECTION_STRING'
              secretRef: storageConnectionStringSecretName
            }
            {
              name: 'STORAGE_CONTAINER_NAME_UNPROCESSED'
              value: storageContainerNameUnprocessed
            }
            {
              name: 'STORAGE_CONTAINER_NAME_PROCESSED'
              value: storageContainerNameProcessed
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
      }
    }
  }
}

output name string = containerApp.name
output appUrl string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
