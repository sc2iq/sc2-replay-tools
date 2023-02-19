export const secondsPerMinute = 60

export type BuildingName =
    | "Command Center"
    | "Orbital"
    | "Supply"
    | "Refinery"
    | "Barracks"
    | "Reactor"
    | "TechLab"
    | "Factory"
    | "Starport"

export const buildingNameToBuildTime: Record<BuildingName, number> = {
    "Command Center": 71,
    "Orbital": 25,
    "Supply": 21,
    "Refinery": 21,
    "Barracks": 46,
    "Reactor": 36,
    "TechLab": 18,
    "Factory": 43,
    "Starport": 36,
}

export type UnitName =
    | BuildingName
    | "Orbital"
    | "Reactor"
    | "TechLab"
    | "SCV"
    | "Supply"
    | "Marine"
    | "Reaper"
    | "Marauder"
    | "Ghost"
    | "Hellion"
    | "WidowMine"
    | "Cyclone"
    | "SiegeTank"
    | "Hellbat"
    | "Thor"
    | "Viking"
    | "Medivac"
    | "Liberator"
    | "Raven"
    | "Banshee"
    | "Battlecruiser"

export const unitNameToBuildTime: Record<UnitName, number> = {
    ...buildingNameToBuildTime,
    "SCV": 12,
    "Marine": 18,
    "Reaper": 32,
    "Marauder": 21,
    "Ghost": 29,
    "Hellion": 21,
    "WidowMine": 21,
    "Cyclone": 32,
    "SiegeTank": 32,
    "Hellbat": 21,
    "Thor": 43,
    "Viking": 30,
    "Medivac": 30,
    "Liberator": 43,
    "Raven": 34,
    "Banshee": 43,
    "Battlecruiser": 64,
}
