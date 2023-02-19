import { buildOrder as badBuildOrder } from "~/buildOrders/bad"
import { buildOrder as goodBuildOrder } from "~/buildOrders/good"
import { BuildOrder } from "~/models"

export const buildOrder: BuildOrder = {
    buildings: []
}

const goodBuildOrderCopy = structuredClone(goodBuildOrder)
const badBuildOrderCopy = structuredClone(badBuildOrder)

for (const [index, goodBuilding] of goodBuildOrderCopy.buildings.entries()) {
    const badBuilding = badBuildOrderCopy.buildings[index]

    goodBuilding.playerIndex = 0
    badBuilding.playerIndex = 1

    buildOrder.buildings.push(goodBuilding, badBuilding)
}