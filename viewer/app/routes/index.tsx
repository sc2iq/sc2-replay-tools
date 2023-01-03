import { LinksFunction, LoaderFunction } from "@remix-run/node";
import indexStyles from "../styles/index.css"

export const loader: LoaderFunction = async () => {
  return {
    buildings: [
      {
        name: 'Command Center', time: 0, production: [
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
  return (
    <div>
      <h1>Data C (8).SC2Replay</h1>
      <div className="untilizationGrid">
        <div className="row">
          <div className="header">Time</div>
          <div>Building Name</div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="row even">
          <div className="header">&nbsp;</div>
          <div>00:00</div>
          <div>00:10</div>
          <div>00:20</div>
          <div>00:30</div>
          <div>00:40</div>
        </div>
        <div className="row">
          <div>00:00</div>
          <div>Command Center</div>
        </div>
      </div>
    </div>
  );
}
