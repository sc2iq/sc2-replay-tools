import { buildOrder as badBuildOrder } from "~/buildOrders/bad"
import { buildOrder as goodBuildOrder } from "~/buildOrders/good"
import { BuildOrder } from "~/models"

export const buildOrder: BuildOrder = {
    buildings: []
}

for (const [index, goodBuilding] of goodBuildOrder.buildings.entries()) {
    const badBuilding = badBuildOrder.buildings[index]

    buildOrder.buildings.push(goodBuilding, badBuilding)
}