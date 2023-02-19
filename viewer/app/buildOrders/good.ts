import { BuildOrder } from "~/models"

export const buildOrder: BuildOrder = {
    buildings: [
        {
            name: 'Command Center',
            startTime: 0,
            production: [
                { name: 'SCV', startTime: 0 },
                { name: 'SCV', startTime: 12 },
                { name: 'SCV', startTime: 24 },
                { name: 'SCV', startTime: 36 },
                { name: 'SCV', startTime: 50 },
                { name: 'SCV', startTime: 62 },
                { name: 'SCV', startTime: 74 },
                { name: 'Orbital', startTime: 88 },
                { name: 'SCV', startTime: 113 },
                { name: 'SCV', startTime: 127 },
                { name: 'SCV', startTime: 155 },
            ]
        },
        {
            name: 'Supply',
            startTime: 17,
            production: [
                {
                    name: "Supply",
                    startTime: 133,
                },
                {
                    name: "Supply",
                    startTime: 222,
                }
            ]
        },
        {
            name: 'Barracks',
            startTime: 39,
            production: [
                {
                    name: "Reaper",
                    startTime: 88,
                },
                {
                    name: "Marine",
                    startTime: 121,
                },
                {
                    name: "Reactor",
                    startTime: 144,
                }
            ]
        },
        {
            name: 'Refinery',
            startTime: 46,
            production: [
            ]
        },
        {
            name: 'Command Center',
            startTime: 102,
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
            startTime: 126,
            production: [
                {
                    name: "Hellion",
                    startTime: 193,
                },
                {
                    name: "Hellion",
                    startTime: 194,
                },
            ]
        },
        {
            name: 'Refinery',
            startTime: 186,
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