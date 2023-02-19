import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { buildOrder as badBuildOrder } from "~/buildOrders/bad"
import { buildOrder as combinedBuildOrder } from "~/buildOrders/combined"
import { buildOrder as goodBuildOrder } from "~/buildOrders/good"
import { BuildOrderComponent } from "~/components/buildOrder"
import indexStyles from "../styles/index.css"

export const loader = async ({ }: DataFunctionArgs) => {
  return {
    goodBuildOrder,
    badBuildOrder,
    combinedBuildOrder,
  }
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: indexStyles },
]

export default function Index() {
  const { goodBuildOrder, badBuildOrder, combinedBuildOrder } = useLoaderData<typeof loader>()


  return (
    <>
      <div className="uploadForm">
        <label htmlFor="replayFileInput">Replay File:</label>
        <input type="file" id="replayFileInput" name="replayFileInput" />
        <button type="submit">Upload</button>
      </div>

      <h2 className="replayTitle">GoodBuildOrder</h2>
      <BuildOrderComponent buildOrder={goodBuildOrder} />
      <h2 className="replayTitle">BadBuildOrder</h2>
      <BuildOrderComponent buildOrder={badBuildOrder} />
      <h2 className="replayTitle">Compare: GoodBuildOrder to BadBuildOrder</h2>
      <BuildOrderComponent buildOrder={combinedBuildOrder} />
    </>
  )
}
