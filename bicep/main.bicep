var uniqueRgString = take(uniqueString(resourceGroup().id), 6)

module storageContainers 'modules/storageContainers.bicep' = {
  name: 'storageContainersModule'
  params: {
    uniqueRgString: uniqueRgString
  }
}
