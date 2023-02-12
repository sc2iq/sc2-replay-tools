import { CSSProperties } from "react"
import { unitNameToBuildTime, Units } from "~/constants"

type Props = {
    name: Units
    startTime: number
}

export const Unit: React.FC<Props> = props => {
    const buildTime = unitNameToBuildTime[props.name]
    const cssProps: CSSProperties = {
        ['--start-time-seconds' as any]: props.startTime,
        ['--build-time-seconds' as any]: buildTime
    }

    return (
        <div className="unit" style={cssProps}>{props.name}</div>
    )
}