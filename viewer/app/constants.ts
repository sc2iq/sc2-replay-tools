export const secondsPerMinute = 60

export type BuildingName =
    | "Command Center"
    | "Orbital"
    | "Supply Depot"
    | "Refinery"
    | "Barracks"
    | "Factory"

export const buildingNameToBuildTime: Record<BuildingName, number> = {
    "Command Center": 10,
    "Orbital": 12,
    "Supply Depot": 20,
    "Refinery": 10,
    "Barracks": 10,
    "Factory": 10,
}

export type UnitName =
    | "Orbital"
    | "SCV"
    | "Supply"
    | "Reaper"
    | "Marine"
    | "Marauder"

export const unitNameToBuildTime: Record<UnitName, number> = {
    "Orbital": 10,
    "SCV": 12,
    "Supply": 20,
    "Reaper": 10,
    "Marine": 10,
    "Marauder": 10,
}
