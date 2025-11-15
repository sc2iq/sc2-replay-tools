targetScope = 'subscription'

param environmentName string
param location string

param sharedResourceGroupName string
param sharedContainerAppsEnvironmentName string
param sharedAcrName string

param resourceGroupName string

resource sharedRg 'Microsoft.Resources/resourceGroups@2025-04-01' existing = {
  name: sharedResourceGroupName
}

resource sharedContainerAppsEnv 'Microsoft.App/managedEnvironments@2025-02-02-preview' existing = {
  name: sharedContainerAppsEnvironmentName
  scope: sharedRg
}

resource sharedAcr 'Microsoft.ContainerRegistry/registries@2025-05-01-preview' existing = {
  name: sharedAcrName
  scope: sharedRg
}

var uniqueRgString = take(uniqueString(sharedRg.id), 6)

module storageContainers 'modules/storageContainers.bicep' = {
  name: 'storageContainersModule'
  scope: sharedRg
  params: {
    uniqueRgString: uniqueRgString
  }
}

var tags = {
  'azd-env-name': '${resourceGroupName}-${environmentName}'
  project: resourceGroupName
}

resource rg 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

var defaultImageName = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

param clientContainerAppName string = '${resourceGroupName}-replay-analyzer-client'
param clientContainerAppImageName string = ''

@secure()
param storageConnectionString string
param storageContainerNameUnprocessed string
param storageContainerNameProcessed string

module clientContainerApp 'modules/clientContainerApp.bicep' = {
  name: 'clientContainerAppModule'
  scope: rg
  params: {
    name: clientContainerAppName
    location: location
    tags: union(tags, { 'azd-service-name': 'client' })
    imageName: !empty(clientContainerAppImageName) ? clientContainerAppImageName : defaultImageName
    managedEnvironmentResourceId: sharedContainerAppsEnv.id
    containerName: clientContainerAppName
    registryUsername: sharedAcr.name
    registryPassword: sharedAcr.listCredentials().passwords[0].value
    storageConnectionString: storageConnectionString
    storageContainerNameUnprocessed: storageContainerNameUnprocessed
    storageContainerNameProcessed: storageContainerNameProcessed
  }
}

param replayProcessorContainerAppName string = '${resourceGroupName}-replay-processor'
param replayProcessorContainerAppImageName string = ''

param storageAccountName string

module replayProcessorContainerApp 'modules/pythonProcessorContainerApp.bicep' = {
  name: 'replayProcessorContainerAppModule'
  scope: rg
  params: {
    name: replayProcessorContainerAppName
    location: location
    tags: union(tags, { 'azd-service-name': 'replay-processor' })
    imageName: !empty(replayProcessorContainerAppImageName) ? replayProcessorContainerAppImageName : defaultImageName
    managedEnvironmentResourceId: sharedContainerAppsEnv.id
    containerName: replayProcessorContainerAppName
    registryUsername: sharedAcr.name
    registryPassword: sharedAcr.listCredentials().passwords[0].value
    storageAccountName: storageAccountName
    storageConnectionString: storageConnectionString
    storageContainerNameUnprocessed: storageContainerNameUnprocessed
    storageContainerNameProcessed: storageContainerNameProcessed
  }
}
