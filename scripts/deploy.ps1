$sharedResourceGroupName = "shared"
$sharedRgString = 'klgoyi'
$resourceGroupLocation = "westus3"
$sc2ResourceGroupName = "sc2"

echo "PScriptRoot: $PScriptRoot"
$repoRoot = If ('' -eq $PScriptRoot) {
  "$PSScriptRoot/.."
}
Else {
  "."
}

echo "Repo Root: $repoRoot"

Import-Module "C:/repos/shared-resources/pipelines/scripts/common.psm1" -Force

$sharedResourceNames = Get-ResourceNames $sharedResourceGroupName $sharedRgString

Write-Step "Create Resource Group: $sc2ResourceGroupName"
az group create -l $resourceGroupLocation -g $sc2ResourceGroupName --query name -o tsv

$envFilePath = $(Resolve-Path "$repoRoot/scripts/.env").Path

Write-Step "Get ENV Vars from $envFilePath"
$storageConnectionString = $(az storage account show-connection-string -g $sharedResourceGroupName -n $sharedResourceNames.storageAccount --query "connectionString" -o tsv)

Write-Step "Fetch params from Azure"
$sharedResourceVars = Get-SharedResourceDeploymentVars $sharedResourceGroupName $sharedRgString

$clientContainerName = "$sharedResourceGroupName-replay-analyzer-client"
$clientImageTag = $(Get-Date -Format "yyyyMMddhhmm")
$clientImageName = "$($sharedResourceVars.registryUrl)/${clientContainerName}:${clientImageTag}"

$data = [ordered]@{
  "storageConnectionString"    = "$($storageConnectionString.Substring(0, 15))..."
  "clientImageName"            = $clientImageName

  "containerAppsEnvResourceId" = $($sharedResourceVars.containerAppsEnvResourceId)
  "registryUrl"                = $($sharedResourceVars.registryUrl)
  "registryUsername"           = $($sharedResourceVars.registryUsername)
  "registryPassword"           = "$($($sharedResourceVars.registryPassword).Substring(0, 5))..."
}

Write-Hash "Data" $data

Write-Step "Provision Additional $sharedResourceGroupName Resources"
$mainBicepFile = "$repoRoot/bicep/main.bicep"
az deployment group create `
  -g $sharedResourceGroupName `
  -f $mainBicepFile `
  --query "properties.provisioningState" `
  -o tsv

Write-Step "Provision $sc2ResourceGroupName Resources"

Write-Step "Build and Push $clientImageName Image"
docker build -t $clientImageName "$repoRoot/viewer"
docker push $clientImageName

# # az acr build -r $registryUrl -t $clientImageName "$repoRoot/apps/website"

Write-Step "Deploy $clientImageName Container App"
$clientBicepContainerDeploymentFilePath = "$repoRoot/bicep/modules/clientContainerApp.bicep"
$clientFqdn = $(az deployment group create `
    -g $sc2ResourceGroupName `
    -f $clientBicepContainerDeploymentFilePath `
    -p managedEnvironmentResourceId=$($sharedResourceVars.containerAppsEnvResourceId) `
    registryUrl=$($sharedResourceVars.registryUrl) `
    registryUsername=$($sharedResourceVars.registryUsername) `
    registryPassword=$($sharedResourceVars.registryPassword) `
    imageName=$clientImageName `
    containerName=$clientContainerName `
    storageConnectionString=$storageConnectionString `
    storageContainerName="replays-unprocessed" `
    --query "properties.outputs.fqdn.value" `
    -o tsv)

$clientUrl = "https://$clientFqdn"
Write-Output $clientUrl
