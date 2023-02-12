import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Unit } from "~/components/unit"
import indexStyles from "../styles/index.css"

export const loader = async ({}: DataFunctionArgs) => {
  const buildOrder = {
    buildings: [
      {
        name: 'Command Center',
        starTime: 0,
        buildTime: 0,
        production: [
          { name: 'SCV', startTime: 0, buildTime: 17 },
          { name: 'SCV', startTime: 17, buildTime: 17 },
          { name: 'SCV', startTime: 30, buildTime: 17 },
        ]
      }
    ]
  }

  return {
    buildOrder
  }
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: indexStyles },
]

export default function Index() {
  const { buildOrder } = useLoaderData<typeof loader>()

  const maxTime = 200
  const timeSlice = 10

  return (
    <div>
      <h1>Data C (8).SC2Replay</h1>
      <div className="untilizationGrid">
        <div className="row headers">
          <div className="header time">Time</div>
          <div className="header buildingName">Building Name</div>
          <div className="times">
            {Array(Math.ceil(maxTime / timeSlice)).fill(0).map((_, i) => {
              const totalSeconds = i * timeSlice
              const minutes = Math.floor(totalSeconds / 60)
              const reminaderSeconds = Math.round(((totalSeconds / 60) - minutes) * 60)

              return <div>
                {minutes.toString().padStart(2, '0')}:
                {reminaderSeconds.toString().padStart(2, '0')}
              </div>
            })}
          </div>
        </div>
        <div className="row">
          <div className="time">00:00</div>
          <div className="buildingName">Command Center</div>
          <div className="units">
            <div className="buildingComplete">
              <Unit
                name="SCV"
                startTime={0}
              />
              <Unit
                name="SCV"
                startTime={12}
              />
              <Unit
                name="SCV"
                startTime={24}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="time">00:10</div>
          <div className="buildingName">Supply</div>
          <div className="units">
            <div className="buildingComplete">
              <Unit
                name="Supply"
                startTime={15}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
