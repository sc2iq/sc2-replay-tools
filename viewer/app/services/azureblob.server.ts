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

export async function waitForBlob(
    blobClient: BlobClient,
    intervalMs = 1000,
    maxIterations = 100,
): Promise<BlobClient> {
    console.log(`Poll for ${blobClient.url} every ${intervalMs} ms`)
    let iterationCount = 1

    while (!(await blobClient.exists())) {
        console.log(`${iterationCount.toString().padStart(2, '0')}: Blob ${blobClient.url} does not exist yet. Delay: ${intervalMs} ms ${Date.now()}`)
        await delay(intervalMs)

        iterationCount += 1
        if (iterationCount > maxIterations) {
            console.log(`Blob polling loop reached the max interations: ${maxIterations}! Stopping poll.`)
            break
        }
    }

    return blobClient
}