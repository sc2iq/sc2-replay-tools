import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob"
import invariant from "tiny-invariant"

export default function uploadFileAsBlobToAzure(
    blobName: string,
    data: any
) {
    invariant(typeof process.env.AZURE_STORAGE_ACCOUNT_NAME === 'string', `You attempt to upload file to blob storage, but the AZURE_STORAGE_ACCOUNT_NAME environment variable was not set!`)
    invariant(typeof process.env.AZURE_STORAGE_ACCOUNT_KEY === 'string', `You attempt to upload file to blob storage, but the AZURE_STORAGE_ACCOUNT_KEY environment variable was not set!`)
    invariant(typeof process.env.AZURE_STORAGE_CONTAINER_NAME === 'string', `You attempt to upload file to blob storage, but the AZURE_STORAGE_CONTAINER_NAME environment variable was not set!`)

    const sharedKeyCredential = new StorageSharedKeyCredential(
        process.env.AZURE_STORAGE_ACCOUNT_NAME,
        process.env.AZURE_STORAGE_ACCOUNT_KEY,
    )
    const blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        sharedKeyCredential
    )

    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME)

    // containerClient.uploadBlockBlob()
    
    return `${blobServiceClient.accountName} - ${blobName}`
}