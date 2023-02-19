import { BuildingName, UnitName } from "./constants"

export type BuildOrder = {
    buildings: Building[]
}

export type Building = {
    name: BuildingName
    startTime: number
    production: ProductionEvent[]
    playerIndex?: number
}

export type ProductionEvent = {
    name: UnitName
    startTime: number
}