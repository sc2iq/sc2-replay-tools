import { secondsPerMinute } from "./constants"

export function getDisplayTimeFromTotalSeconds(seconds: number) {
    const minutes = Math.floor(seconds / secondsPerMinute)
    const reminaderSeconds = Math.round(((seconds / secondsPerMinute) - minutes) * secondsPerMinute)

    return `${minutes.toString().padStart(2, '0')}:${reminaderSeconds.toString().padStart(2, '0')}`
}