import { unitNameToBuildTime } from "~/constants"
import { getDisplayTimeFromTotalSeconds, getUtilization } from "~/helpers"
import { BuildOrder } from "~/models"
import { Building } from "./building"
import { Unit } from "./unit"

type Props = {
    buildOrder: BuildOrder
}

export const BuildOrderComponent: React.FC<Props> = props => {
    const latestEndTime = props.buildOrder.buildings
        .flatMap(b => b.production)
        .map(unit => unit.startTime + unitNameToBuildTime[unit.name])
        .reduce((max, endTime) => Math.max(max, endTime), 0)
    const maxTime = latestEndTime
    const timeSlice = 10

    return (
        <div className="untilizationGrid">
            <div className="row headers">
                <div className="header time">Time</div>
                <div className="header buildingName">Building Name</div>
                <div className="header utilization">Util %</div>
                <div className="times">
                    {Array(Math.ceil(maxTime / timeSlice)).fill(0).map((_, i) => {
                        const totalSeconds = i * timeSlice

                        return <div>{getDisplayTimeFromTotalSeconds(totalSeconds)}</div>
                    })}
                </div>
            </div>
            {props.buildOrder.buildings.map((building, i) => {

                const utilization = getUtilization(building, latestEndTime)
                return (
                    <div className={`row player-index-${building.playerIndex}`}>
                        <div className="time">{getDisplayTimeFromTotalSeconds(building.startTime)}</div>
                        <div className="buildingName">{building.name}</div>
                        <div className="utilization">{Math.floor(utilization * 100)}%</div>
                        <div className="units">
                            <div className="buildingComplete" style={{ ['--start-time-seconds' as any]: building.startTime }}>
                                <>
                                    {(building.startTime !== 0) && (
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
                                                building={building}
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
    )
}