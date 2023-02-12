
export type Units =
    | "SCV"
    | "Supply"

export const unitNameToBuildTime: Record<Units, number> = {
    "SCV": 12,
    "Supply": 20,
}