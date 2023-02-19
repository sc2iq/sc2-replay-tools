import { ActionArgs, LinksFunction, LoaderArgs, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { buildOrder as badBuildOrder } from "~/buildOrders/bad"
import { buildOrder as combinedBuildOrder } from "~/buildOrders/combined"
import { buildOrder as goodBuildOrder } from "~/buildOrders/good"
import { BuildOrderComponent } from "~/components/buildOrder"
import uploadFileAsBlobToAzure from "~/services/azureblob.server"
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
  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      console.log({ name, contentType, data, filename })
      if (name === "replayFileInput"
        && typeof filename === 'string'
        && filename.length > 0) {
        const blobUrl = uploadFileAsBlobToAzure(filename, data)

        return blobUrl
      }

      return undefined
    },
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  )

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler // <-- we'll look at this deeper next
  )

  const formDataEntries = Object.fromEntries(formData)
  console.log({ formDataEntries })

  return null
}

export default function Index() {
  const { goodBuildOrder, badBuildOrder, combinedBuildOrder } = useLoaderData<typeof loader>()

  return (
    <>
      <Form method="post" encType="multipart/form-data" className="uploadForm">
        <label htmlFor="replayFileInput">Replay File:</label>
        <input type="file" id="replayFileInput" name="replayFileInput" accept=".sc2replay" />
        <input type="hidden" name="formName" value="replayFile" />
        <button type="submit">Upload</button>
      </Form>

      <h2 className="replayTitle">GoodBuildOrder</h2>
      <BuildOrderComponent buildOrder={goodBuildOrder} />
      <h2 className="replayTitle">BadBuildOrder</h2>
      <BuildOrderComponent buildOrder={badBuildOrder} />
      <h2 className="replayTitle">Compare: GoodBuildOrder to BadBuildOrder</h2>
      <BuildOrderComponent buildOrder={combinedBuildOrder} />
    </>
  )
}
