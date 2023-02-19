import { secondsPerMinute, unitNameToBuildTime } from "./constants"
import { Building } from "./models"

export function getDisplayTimeFromTotalSeconds(seconds: number) {
    const minutes = Math.floor(seconds / secondsPerMinute)
    const reminaderSeconds = Math.round(((seconds / secondsPerMinute) - minutes) * secondsPerMinute)

    return `${minutes.toString().padStart(1, '0')}:${reminaderSeconds.toString().padStart(2, '0')}`
}

export function getUtilization(building: Building, endTime: number): number {
    const lifetimeSeconds = endTime - building.startTime
    const producingSeconds = building.production
        .map(unit => unitNameToBuildTime[unit.name])
        .reduce((a, b) => a + b, 0)

    return producingSeconds / lifetimeSeconds
}