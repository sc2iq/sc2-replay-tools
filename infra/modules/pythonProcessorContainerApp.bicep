param name string = '${resourceGroup().name}-replay-processor'
param location string = resourceGroup().location
param tags object = {}

param managedEnvironmentResourceId string

param imageName string
param containerName string

param registryUsername string
@secure()
param registryPassword string

param storageAccountName string
@secure()
param storageConnectionString string
param storageContainerNameUnprocessed string
param storageContainerNameProcessed string

var registryPassworldSecretName = 'container-registry-password'
var storageConnectionStringSecretName = 'storage-connection-string'

resource containerApp 'Microsoft.App/containerapps@2022-03-01' = {
  name: name
  location: location
  properties: {
    managedEnvironmentId: managedEnvironmentResourceId
    configuration: {
      activeRevisionsMode: 'Single'
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
          resources: {
            cpu: any('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'NODE_ENV'
              value: 'development'
            }
            {
              name: 'STORAGE_CONNECTION_STRING'
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
        maxReplicas: 2
        rules: [
          {
            name: 'storage-blob'
            custom: {
              type: 'azure-blob'
              metadata: {
                blobContainerName: storageContainerNameUnprocessed
                blobCount: string(1)
                activationBlobCount: string(0)
                connectionFromEnv: 'STORAGE_CONNECTION_STRING'
                accountName: storageAccountName
                cloud: 'AzurePublicCloud'
                recursive: string(false)
              }
              auth: [
                {
                  secretRef: storageConnectionStringSecretName
                  triggerParameter: 'connnection'
                }
              ]
            }
          }
        ]
      }
    }
  }
}

output name string = containerApp.name
output appUrl string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
