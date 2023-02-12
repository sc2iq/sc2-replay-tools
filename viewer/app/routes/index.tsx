import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Building } from "~/components/building"
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
        production: [
          { name: 'SCV', startTime: 0 },
          { name: 'SCV', startTime: 12 },
          { name: 'SCV', startTime: 24 },
          { name: 'SCV', startTime: 36 },
          { name: 'SCV', startTime: 50 },
          { name: 'SCV', startTime: 62 },
          { name: 'SCV', startTime: 76 },
          { name: 'Orbital', startTime: 88 },
          { name: 'SCV', startTime: 116 },
        ]
      },
      {
        name: 'Supply Depot',
        startTime: 16,
        production: [
          {
            name: "Supply",
            startTime: 20,
          }
        ]
      },
      {
        name: 'Barracks',
        startTime: 39,
        production: [
          {
            name: "Reaper",
            startTime: 86,
          },
          {
            name: "Marine",
            startTime: 116,
          }
        ]
      },
      {
        name: 'Refinery',
        startTime: 43,
        production: [
          {
            name: "Marine",
            startTime: 20,
          }
        ]
      },
      {
        name: 'Command Center',
        startTime: 103,
        production: [
          {
            name: "Orbital",
            startTime: 20,
          }
        ]
      },
      {
        name: 'Factory',
        startTime: 126,
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
        {buildOrder.buildings.map((building, i) => {
          return (
            <div className="row">
              <div className="time">{getDisplayTimeFromTotalSeconds(building.startTime)}</div>
              <div className="buildingName">{building.name}</div>
              <div className="units">
                <div className="buildingComplete" style={{ ['--start-time-seconds' as any]: building.startTime }}>
                  <>
                    {(i !== 0 && building.name !== "Supply Depot") && (
                      <Building
                        name={building.name}
                        startTime={building.startTime}
                      />
                    )}
                    {building.production.map(unit => {
                      return (
                        <Unit
                          name={unit.name}
                          startTime={unit.startTime}
                        />
                      )
                    })}
                  </>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
