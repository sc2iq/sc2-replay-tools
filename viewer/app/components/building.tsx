import { CSSProperties } from "react"
import { buildingNameToBuildTime, BuildingName } from "~/constants"

type Props = {
    name: BuildingName
    startTime: number
}

export const Building: React.FC<Props> = props => {
    const buildTime = buildingNameToBuildTime[props.name]
    const cssProps: CSSProperties = {
        ['--start-time-seconds' as any]: props.startTime,
        ['--build-time-seconds' as any]: buildTime
    }

    return (
        <div className="building" style={cssProps}>{props.name}</div>
    )
}