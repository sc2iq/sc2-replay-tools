import { LinksFunction, LoaderFunction } from "@remix-run/node"
import { Unit } from "~/components/unit"
import indexStyles from "../styles/index.css"

export const loader: LoaderFunction = async () => {
  return {
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
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: indexStyles },
]

export default function Index() {

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
              console.log({ totalSeconds, minutes, reminaderSeconds })
              return <div>{minutes.toString().padStart(2, '0')}:{reminaderSeconds.toString().padStart(2, '0')}</div>
            })}
            <div>00:10</div>
            <div>00:20</div>
            <div>00:30</div>
            <div>00:40</div>
          </div>
        </div>
        <div className="row">
          <div className="time">00:00</div>
          <div className="buildingName">Command Center</div>
          <div className="units">
            <div className="buildingComplete">
              <Unit name="SCV" />
              <Unit name="SCV" />
              <Unit name="SCV" />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
