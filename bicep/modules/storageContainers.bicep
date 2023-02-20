param uniqueRgString string

// global	3-24 Alphanumerics.
// https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules#microsoftstorage
@minLength(3)
@maxLength(24)
param name string = '${resourceGroup().name}${uniqueRgString}storage'

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-05-01' existing = {
  name: name
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2022-05-01' existing = {
  parent: storageAccount
  name: 'default'
}

param replaysContainerNameUnprocessed string = 'replays-unprocessed'

resource replaysContainerUnprocessed 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  parent: blobService
  name: replaysContainerNameUnprocessed
}

param replaysContainerNameProcessed string = 'replays-processed'

resource replaysContainerProcessed 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  parent: blobService
  name: replaysContainerNameProcessed
  properties: {
    publicAccess: 'Blob'
  }
}
