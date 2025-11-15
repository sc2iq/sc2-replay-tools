#!/bin/bash

# Load environment variables from azd
source .azure/dev/.env

# Run Azure what-if deployment with detailed output
az deployment sub what-if \
  --location "$AZURE_LOCATION" \
  --template-file ./infra/main.bicep \
  --parameters environmentName="$AZURE_ENV_NAME" \
  --parameters location="$AZURE_LOCATION" \
  --parameters resourceGroupName="$AZURE_RESOURCE_GROUP" \
  --parameters sharedResourceGroupName="$SHARED_RESOURCE_GROUP" \
  --parameters sharedContainerAppsEnvironmentName="$SHARED_CONTAINER_APPS_ENVIRONMENT_NAME" \
  --parameters sharedAcrName="$SHARED_ACR_NAME" \
  --parameters storageAccountName="$STORAGE_ACCOUNT_NAME" \
  --parameters storageConnectionString="$STORAGE_CONNECTION_STRING" \
  --parameters storageContainerNameUnprocessed="$STORAGE_CONTAINER_NAME_UNPROCESSED" \
  --parameters storageContainerNameProcessed="$STORAGE_CONTAINER_NAME_PROCESSED"
