import { BlockBlobClient } from "@azure/storage-blob"
import invariant from "tiny-invariant"

export default function getBlockBlobClient(blobName: string) {
    invariant(typeof process.env.STORAGE_ACCOUNT_CONNECTION_STRING === 'string', `You attempt to upload file to blob storage, but the STORAGE_ACCOUNT_CONNECTION_STRING environment variable was not set!`)
    invariant(typeof process.env.STORAGE_CONTAINER_NAME === 'string', `You attempt to upload file to blob storage, but the STORAGE_CONTAINER_NAME environment variable was not set!`)

    const blobClient = new BlockBlobClient(
        process.env.STORAGE_ACCOUNT_CONNECTION_STRING,
        process.env.STORAGE_CONTAINER_NAME,
        blobName,
    )

    return blobClient
}