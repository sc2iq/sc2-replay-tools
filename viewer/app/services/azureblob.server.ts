import { BlobClient, BlockBlobClient } from "@azure/storage-blob"
import invariant from "tiny-invariant"
import { delay } from "~/utilities"

export function getBlockBlobClient(blobName: string) {
    invariant(typeof process.env.STORAGE_ACCOUNT_CONNECTION_STRING === 'string', `You attempt to upload file to blob storage, but the STORAGE_ACCOUNT_CONNECTION_STRING environment variable was not set!`)
    invariant(typeof process.env.STORAGE_CONTAINER_NAME_UNPROCESSED === 'string', `You attempt to upload file to blob storage, but the STORAGE_CONTAINER_NAME_UNPROCESSED environment variable was not set!`)

    const blobClient = new BlockBlobClient(
        process.env.STORAGE_ACCOUNT_CONNECTION_STRING,
        process.env.STORAGE_CONTAINER_NAME_UNPROCESSED,
        blobName,
    )

    return blobClient
}

export function getBlobClient(blobName: string) {
    invariant(typeof process.env.STORAGE_ACCOUNT_CONNECTION_STRING === 'string', `You attempt to upload file to blob storage, but the STORAGE_ACCOUNT_CONNECTION_STRING environment variable was not set!`)
    invariant(typeof process.env.STORAGE_CONTAINER_NAME_PROCESSED === 'string', `You attempt to upload file to blob storage, but the STORAGE_CONTAINER_NAME_PROCESSED environment variable was not set!`)

    const blobClient = new BlobClient(
        process.env.STORAGE_ACCOUNT_CONNECTION_STRING,
        process.env.STORAGE_CONTAINER_NAME_PROCESSED,
        blobName,
    )

    return blobClient
}

export async function waitForBlob(blobClient: BlobClient, intervalMs = 1000): Promise<BlobClient> {
    console.log(`Poll for ${blobClient.url} every ${intervalMs} ms`)

    while (!(await blobClient.exists())) {
        console.log(`Blob ${blobClient.url} does not exist yet. Delay: ${intervalMs} ms`)
        await delay(intervalMs)
    }

    return blobClient
}