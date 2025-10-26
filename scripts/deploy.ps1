Param([switch]$WhatIf = $True)

$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path $scriptPath

# Find repo root by searching upward for README.md
$currentDir = $scriptDir
$repoRoot = $null
while ($currentDir -and -not $repoRoot) {
  if (Test-Path (Join-Path $currentDir "README.md")) {
    $repoRoot = $currentDir
  }
  else {
    $currentDir = Split-Path $currentDir
  }
}
if (-not $repoRoot) {
  throw "Could not find repo root (no README.md found in parent directories)."
}

echo "Script Path: $scriptPath"
echo "Script Dir: $scriptDir"
echo "Repo Root: $repoRoot"

$sharedModulePath = Resolve-Path "$repoRoot/../../shared-resources/pipelines/scripts/common.psm1"
$localModulePath = Resolve-Path "$repoRoot/scripts/common.psm1"

echo "Shared Module Path: $sharedModulePath"
echo "Local Module Path: $localModulePath"

Import-Module $sharedModulePath -Force
Import-Module $localModulePath -Force

$inputs = @{
  "WhatIf" = $WhatIf
}

Write-Hash "Inputs" $inputs

$sharedResourceGroupName = "shared"
$sharedRgString = 'klgoyi'
$resourceGroupLocation = "westus3"
$sc2ResourceGroupName = "sc2"

$sharedResourceNames = Get-ResourceNames $sharedResourceGroupName $sharedRgString
$sc2ResourceNames = Get-LocalResourceNames $sc2ResourceGroupName 'unused'

Write-Step "Create Resource Group: $sc2ResourceGroupName"
az group create -l $resourceGroupLocation -g $sc2ResourceGroupName --query name -o tsv

$envFilePath = $(Resolve-Path "$repoRoot/scripts/.env").Path

Write-Step "Get ENV Vars from $envFilePath"
$storageConnectionString = $(az storage account show-connection-string -g $sharedResourceGroupName -n $sharedResourceNames.storageAccount --query "connectionString" -o tsv)

Write-Step "Fetch params from Azure"
$sharedResourceVars = Get-SharedResourceDeploymentVars $sharedResourceGroupName $sharedRgString

$clientContainerName = "$sc2ResourceGroupName-replay-analyzer-client"
$clientImageTag = $(Get-Date -Format "yyyyMMddhhmm")
$clientImageName = "$($sharedResourceVars.registryUrl)/${clientContainerName}:${clientImageTag}"

$pythonProcessorContainerName = "$sc2ResourceGroupName-replay-processor"
$pythonProcessorImageTag = $(Get-Date -Format "yyyyMMddhhmm")
$pythonProcessorImageName = "$($sharedResourceVars.registryUrl)/${pythonProcessorContainerName}:${pythonProcessorImageTag}"

$data = [ordered]@{
  "storageConnectionString"         = "$($storageConnectionString.Substring(0, 35))..."
  "storageContainerNameUnprocessed" = $($sc2ResourceNames.storageContainerNameUnprocessed)
  "storageContainerNameProcessed"   = $($sc2ResourceNames.storageContainerNameProcessed)
  "clientImageName"                 = $clientImageName
  "pythonProcessorImageName"        = $pythonProcessorImageName

  "containerAppsEnvResourceId"      = $($sharedResourceVars.containerAppsEnvResourceId)
  "registryUrl"                     = $($sharedResourceVars.registryUrl)
  "registryUsername"                = $($sharedResourceVars.registryUsername)
  "registryPassword"                = "$($($sharedResourceVars.registryPassword).Substring(0, 5))..."
}

Write-Hash "Data" $data

Write-Step "Provision Additional $sharedResourceGroupName Resources"
$mainBicepFile = "$repoRoot/bicep/main.bicep"

if ($WhatIf -eq $True) {
  az deployment group create `
    -g $sharedResourceGroupName `
    -f $mainBicepFile `
    --what-if
}
else {
  az deployment group create `
    -g $sharedResourceGroupName `
    -f $mainBicepFile `
    --query "properties.provisioningState" `
    -o tsv
}

Write-Step "Provision $sc2ResourceGroupName Resources (What-If: $($WhatIf))"

Write-Step "Build and Push $clientImageName Image (What-If: $($WhatIf))"
docker build -t $clientImageName "$repoRoot/viewer"

if ($WhatIf -eq $False) {
  Write-Step "Push $clientImageName Image (What-If: $($WhatIf))"
  docker push $clientImageName
}
else {
  Write-Step "Skipping Push $clientImageName Image (What-If: $($WhatIf))"
}

# az acr build -r $registryUrl -t $clientImageName "$repoRoot/apps/website"

Write-Step "Deploy $clientImageName Container App (What-If: $($WhatIf))"
$clientBicepContainerDeploymentFilePath = "$repoRoot/bicep/modules/clientContainerApp.bicep"

if ($WhatIf -eq $True) {
  az deployment group create `
    -g $sc2ResourceGroupName `
    -f $clientBicepContainerDeploymentFilePath `
    -p managedEnvironmentResourceId=$($sharedResourceVars.containerAppsEnvResourceId) `
    registryUrl=$($sharedResourceVars.registryUrl) `
    registryUsername=$($sharedResourceVars.registryUsername) `
    registryPassword=$($sharedResourceVars.registryPassword) `
    imageName=$clientImageName `
    containerName=$clientContainerName `
    storageConnectionString=$storageConnectionString `
    storageContainerNameUnprocessed=$($sc2ResourceNames.storageContainerNameUnprocessed) `
    storageContainerNameProcessed=$($sc2ResourceNames.storageContainerNameProcessed) `
    --what-if
}
else {
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
      storageContainerNameUnprocessed=$($sc2ResourceNames.storageContainerNameUnprocessed) `
      storageContainerNameProcessed=$($sc2ResourceNames.storageContainerNameProcessed) `
      --query "properties.outputs.fqdn.value" `
      -o tsv)

  $clientUrl = "https://$clientFqdn"
  Write-Output $clientUrl
}

Write-Step "Build and Push $pythonProcessorImageName Image"
docker build -t $pythonProcessorImageName "$repoRoot/replay-processor"

if ($WhatIf -eq $False) {
  Write-Step "Push $pythonProcessorImageName Image (What-If: $($WhatIf))"
  docker push $pythonProcessorImageName
}
else {
  Write-Step "Skipping Push $pythonProcessorImageName Image (What-If: $($WhatIf))"
}

# TODO: Investigate why using 'az acr build' does not work
# az acr build -r $registryUrl -t $pythonProcessorImageName ./replay-processor

Write-Step "Deploy $pythonProcessorImageName Container App"
$pythonProcessorBicepContainerDeploymentFilePath = "$repoRoot/bicep/modules/pythonProcessorContainerApp.bicep"

if ($WhatIf -eq $True) {
  az deployment group create `
    -g $sc2ResourceGroupName `
    -f $pythonProcessorBicepContainerDeploymentFilePath `
    -p managedEnvironmentResourceId=$($sharedResourceVars.containerAppsEnvResourceId) `
    registryUrl=$($sharedResourceVars.registryUrl) `
    registryUsername=$($sharedResourceVars.registryUsername) `
    registryPassword=$($sharedResourceVars.registryPassword) `
    imageName=$pythonProcessorImageName `
    containerName=$pythonProcessorContainerName `
    storageAccountName=$($sharedResourceNames.storageAccount) `
    storageConnectionString=$storageConnectionString `
    storageContainerNameUnprocessed=$($sc2ResourceNames.storageContainerNameUnprocessed) `
    storageContainerNameProcessed=$($sc2ResourceNames.storageContainerNameProcessed) `
    --what-if
}
else {
  az deployment group create `
    -g $sc2ResourceGroupName `
    -f $pythonProcessorBicepContainerDeploymentFilePath `
    -p managedEnvironmentResourceId=$($sharedResourceVars.containerAppsEnvResourceId) `
    registryUrl=$($sharedResourceVars.registryUrl) `
    registryUsername=$($sharedResourceVars.registryUsername) `
    registryPassword=$($sharedResourceVars.registryPassword) `
    imageName=$pythonProcessorImageName `
    containerName=$pythonProcessorContainerName `
    storageAccountName=$($sharedResourceNames.storageAccount) `
    storageConnectionString=$storageConnectionString `
    storageContainerNameUnprocessed=$($sc2ResourceNames.storageContainerNameUnprocessed) `
    storageContainerNameProcessed=$($sc2ResourceNames.storageContainerNameProcessed) `
    --query "properties.provisioningState" `
    -o tsv
}
