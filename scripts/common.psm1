
function Get-LocalResourceNames {
    param (
        [Parameter(Mandatory = $true, Position = 0)]
        [string]$resourceGroupName,
        [Parameter(Mandatory = $true, Position = 1)]
        [string]$uniqueRgString
    )

    $resourceNames = [ordered]@{
        storageContainerNameUnprocessed = "replays-unprocessed"
        storageContainerNameProcessed   = "replays-processed"
    }

    return $resourceNames
}
