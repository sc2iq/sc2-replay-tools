import { BuildOrder } from "~/models"

export const buildOrder: BuildOrder = {
    buildings: [
        {
            name: 'Command Center',
            startTime: 0,
            production: [
                { name: 'SCV', startTime: 0 },
                { name: 'SCV', startTime: 14 },
                { name: 'SCV', startTime: 28 },
                { name: 'SCV', startTime: 40 },
                { name: 'SCV', startTime: 60 },
                { name: 'SCV', startTime: 75 },
                { name: 'SCV', startTime: 94 },
                { name: 'Orbital', startTime: 107 },
                { name: 'SCV', startTime: 133 },
                { name: 'SCV', startTime: 157 },
                { name: 'SCV', startTime: 195 },
            ]
        },
        {
            name: 'Supply',
            startTime: 19,
            production: [
                {
                    name: "Supply",
                    startTime: 143,
                },
                {
                    name: "Supply",
                    startTime: 242,
                }
            ]
        },
        {
            name: 'Barracks',
            startTime: 42,
            production: [
                {
                    name: "Reaper",
                    startTime: 92,
                },
                {
                    name: "Marine",
                    startTime: 131,
                },
                {
                    name: "Reactor",
                    startTime: 154,
                }
            ]
        },
        {
            name: 'Refinery',
            startTime: 47,
            production: [
            ]
        },
        {
            name: 'Command Center',
            startTime: 103,
            production: [
                {
                    name: "Orbital",
                    startTime: 187,
                },
                { name: 'SCV', startTime: 167 },
            ]
        },
        {
            name: 'Factory',
            startTime: 130,
            production: [
                {
                    name: "Hellion",
                    startTime: 203,
                },
                {
                    name: "Hellion",
                    startTime: 204,
                },
            ]
        },
        {
            name: 'Refinery',
            startTime: 190,
            production: [
            ]
        },
        {
            name: 'Starport',
            startTime: 189,
            production: [
                {
                    name: "Liberator",
                    startTime: 227,
                }
            ]
        },
    ]
}