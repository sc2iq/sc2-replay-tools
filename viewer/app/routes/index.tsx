import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Unit } from "~/components/unit"
import { getDisplayTimeFromTotalSeconds } from "~/helpers"
import { BuildOrder } from "~/models"
import indexStyles from "../styles/index.css"

export const loader = async ({ }: DataFunctionArgs) => {
  const buildOrder: BuildOrder = {
    buildings: [
      {
        name: 'Command Center',
        startTime: 0,
        buildTime: 0,
        production: [
          { name: 'SCV', startTime: 0 },
          { name: 'SCV', startTime: 12 },
          { name: 'SCV', startTime: 24 },
        ]
      },
      {
        name: 'Supply Depot',
        startTime: 15,
        buildTime: 20,
        production: [
          {
            name: "Supply",
            startTime: 20,
          }
        ]
      },
      {
        name: 'Barracks',
        startTime: 15,
        buildTime: 20,
        production: [
          {
            name: "Marine",
            startTime: 20,
          }
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
    <>
      <header>
        <h1>StarCraft 2 Build Order Analysis</h1>
      </header>

      <div className="uploadForm">
        <label htmlFor="replayFileInput">Replay File:</label>
        <input type="file" id="replayFileInput" />
        <button type="submit">Upload</button>
      </div>

      <h2 className="replayTitle">Data C (8).SC2Replay</h2>
      <div className="untilizationGrid">
        <div className="row headers">
          <div className="header time">Time</div>
          <div className="header buildingName">Building Name</div>
          <div className="times">
            {Array(Math.ceil(maxTime / timeSlice)).fill(0).map((_, i) => {
              const totalSeconds = i * timeSlice

              return <div>{getDisplayTimeFromTotalSeconds(totalSeconds)}</div>
            })}
          </div>
        </div>
        {buildOrder.buildings.map(building => {
          return (
            <div className="row">
              <div className="time">{getDisplayTimeFromTotalSeconds(building.startTime)}</div>
              <div className="buildingName">{building.name}</div>
              <div className="units">
                <div className="buildingComplete" style={{ ['--start-time-seconds' as any]: building.buildTime }}>
                  {building.production.map(unit => {
                    return (
                      <Unit
                        name="SCV"
                        startTime={unit.startTime}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
