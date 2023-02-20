# SC2 Replay Analysis Tools - Viewer

## Getting Started

### Build Image

```powershell
docker build -t sc2-replay-analyzer-client .
```

### Run Container

```powershell
$sharedResourceGroupName = "shared"
$sharedRgString = 'klgoyi'

Import-Module "C:/repos/shared-resources/pipelines/scripts/common.psm1" -Force

$sharedResourceNames = Get-ResourceNames $sharedResourceGroupName $sharedRgString

$storageConnectionString = $(az storage account show-connection-string -g $sharedResourceGroupName -n $sharedResourceNames.storageAccount --query "connectionString" -o tsv)
$storageContainerName = 'replays-unprocessed'

docker run -it --rm `
    -p 3000:8080 `
    -e STORAGE_ACCOUNT_CONNECTION_STRING=$storageConnectionString `
    -e STORAGE_CONTAINER_NAME=$storageContainerName `
    sc2-replay-analyzer-client
```