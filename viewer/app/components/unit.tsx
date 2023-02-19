import { CSSProperties } from "react"
import { buildingNameToBuildTime, UnitName, unitNameToBuildTime } from "~/constants"
import { getDisplayTimeFromTotalSeconds } from "~/helpers"
import { Building } from "~/models"

type Props = {
    name: UnitName
    startTime: number
    building: Building
}

export const Unit: React.FC<Props> = props => {
    const buildingCompleteTime = props.building.startTime + buildingNameToBuildTime[props.building.name]
    const buildTime = unitNameToBuildTime[props.name]
    if (props.startTime <= buildingCompleteTime) {
        console.error(`You attempted to render unit with start time: ${props.startTime} which occurred before the building start `)
    }

    const offset = props.startTime - props.building.startTime
    const cssProps: CSSProperties = {
        ['--start-time-seconds' as any]: offset,
        ['--build-time-seconds' as any]: buildTime
    }

    return (
        <div className="unit" style={cssProps}>{props.name} ({getDisplayTimeFromTotalSeconds(props.startTime)}+{buildTime})</div>
    )
}