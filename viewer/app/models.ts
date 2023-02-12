import { BuildingName, UnitName } from "./constants"

export type BuildOrder = {
    buildings: Building[]
}

export type Building = {
    name: BuildingName
    startTime: number
    production: ProductionEvent[]
}

export type ProductionEvent = {
    name: UnitName
    startTime: number
}