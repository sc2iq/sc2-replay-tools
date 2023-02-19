import { CSSProperties } from "react"
import { BuildingName, buildingNameToBuildTime } from "~/constants"
import { getDisplayTimeFromTotalSeconds } from "~/helpers"

type Props = {
    name: BuildingName
    startTime: number
}

export const Building: React.FC<Props> = props => {
    const buildTime = buildingNameToBuildTime[props.name]
    const cssProps: CSSProperties = {
        ['--start-time-seconds' as any]: 0,
        ['--build-time-seconds' as any]: buildTime
    }

    return (
        <div className="unit building" style={cssProps}>{props.name} ({getDisplayTimeFromTotalSeconds(props.startTime)}+{buildTime})</div>
    )
}