import { getDisplayTimeFromTotalSeconds } from "~/helpers"
import { BuildOrder } from "~/models"
import { Building } from "./building"
import { Unit } from "./unit"

type Props = {
    buildOrder: BuildOrder
}

export const BuildOrderComponent: React.FC<Props> = props => {
    const maxTime = 200
    const timeSlice = 10

    return (
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
            {props.buildOrder.buildings.map((building, i) => {
                return (
                    <div className="row">
                        <div className="time">{getDisplayTimeFromTotalSeconds(building.startTime)}</div>
                        <div className="buildingName">{building.name}</div>
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