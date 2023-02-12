export type BuildingName =
    | "Command Center"
    | "Supply Depot"
    | "Barracks"
    | "Factory"

export type UnitName =
    | "SCV"
    | "Supply"
    | "Reaper"
    | "Marine"
    | "Marauder"

export const unitNameToBuildTime: Record<UnitName, number> = {
    "SCV": 12,
    "Supply": 20,
    "Reaper": 10,
    "Marine": 10,
    "Marauder": 10,
}

export const secondsPerMinute = 60