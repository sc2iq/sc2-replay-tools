import { BlobClient } from "@azure/storage-blob"
import { ActionArgs, LinksFunction, LoaderArgs, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node"
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react"
import { createRef } from "react"
import { buildOrder as badBuildOrder } from "~/buildOrders/bad"
import { buildOrder as combinedBuildOrder } from "~/buildOrders/combined"
import { buildOrder as goodBuildOrder } from "~/buildOrders/good"
import { BuildOrderComponent } from "~/components/buildOrder"
import { getBlobClient, getBlockBlobClient, waitForBlob } from "~/services/azureblob.server"
import { delay } from "~/utilities"
import indexStyles from "../styles/index.css"

export const loader = async ({ }: LoaderArgs) => {
  return {
    goodBuildOrder,
    badBuildOrder,
    combinedBuildOrder,
  }
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: indexStyles },
]

export const action = async ({ request }: ActionArgs) => {

  const requestContentType = request.headers.get('content-type')
  const isFileUpload = requestContentType?.startsWith('multipart/form-data') ?? false
  if (isFileUpload) {
    const uploadHandler = unstable_createMemoryUploadHandler()
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    )

    const replayFileEntries = formData.getAll('replayFileInput')
    for (const replayFileEntry of replayFileEntries) {
      const replayFile = replayFileEntry as File
      const blobName = `replay-${Date.now()}`
      const replayUnprocessedBlobName = `${blobName}.SC2Replay`
      const replayProcessedBlobName = `${blobName}.json`
      const replayUnprocessedBlobClient = getBlockBlobClient(replayUnprocessedBlobName)
      const replayProcessedBlobClient = getBlobClient(replayProcessedBlobName)
      console.log(`Uploading ${replayFile.name} as ${replayUnprocessedBlobName} to ${replayUnprocessedBlobClient.containerName}`)

      await replayUnprocessedBlobClient.uploadData(
        await replayFile.arrayBuffer(),
        {
          blobHTTPHeaders: {
            blobContentType: replayFile.type,
          },
        })

      const maxWaitTime = 10000
      const result = await Promise.race([
        delay(maxWaitTime),
        waitForBlob(replayProcessedBlobClient)
      ])

      if (result instanceof BlobClient) {
        console.log(`Blob processed!`)
      }
      else {
        console.log(`Blob was NOT processed within ${maxWaitTime/1000} seconds`)
      }

      return {
        blobUrl: replayUnprocessedBlobClient.url,
        processedReplayUrl: replayProcessedBlobClient.url,
      }
    }
  }

  return null
}

export default function Index() {
  const { goodBuildOrder, badBuildOrder, combinedBuildOrder } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const formRef = createRef<HTMLFormElement>()
  const transition = useTransition()
  if (typeof actionData?.blobUrl === 'string') {
    formRef.current?.reset()
    console.log(`Reset form!`)
  }

  return (
    <>
      <Form method="post" encType="multipart/form-data" className="uploadForm" ref={formRef}>
        <label htmlFor="replayFileInput">Replay File:</label>
        <input type="file" id="replayFileInput" name="replayFileInput" accept=".sc2replay" required />
        <input type="hidden" name="formName" value="replayFile" />
        <button type="submit">Upload</button>
      </Form>
      {transition?.state === 'idle' && actionData?.blobUrl && actionData?.processedReplayUrl && (
        <div className="uploadConfirmation">
          <div>Replay uploaded...</div>
          <div>Processed Replay will be available here: <a href={actionData.processedReplayUrl} target="_blank">{actionData.processedReplayUrl}</a></div>
        </div>
      )}

      <h2 className="replayTitle">GoodBuildOrder</h2>
      <BuildOrderComponent buildOrder={goodBuildOrder} />
      <h2 className="replayTitle">BadBuildOrder</h2>
      <BuildOrderComponent buildOrder={badBuildOrder} />
      <h2 className="replayTitle">Compare: GoodBuildOrder to BadBuildOrder</h2>
      <BuildOrderComponent buildOrder={combinedBuildOrder} />
    </>
  )
}
