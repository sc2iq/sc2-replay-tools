# SC2 Replay Reader

Replay analyzer to assess production utilization
As building qualifies, if is not flying and can be building something (unit, upgrade, addon, etc)

What percentage of the time the building exists, is it producing?

## Getting Started

```powershell
python ./src/read.py './replays/Data-C (8).SC2Replay'
```

## Using sc2json

```powershell
sc2json -i 4 -e utf8 './replays/Data-C (8).SC2Replay'
```
```powershell
```
  
## Resources

- https://github.com/GraylinKim/sc2reader
- https://sc2reader.readthedocs.io/en/latest/

### Notes

Bar graph
Rows are buildings
Event for building started
Events for building completed
Events for unit trained

#### Initial

- replay.initData
    - Records game client information and lobby slot data.
- replay.details
    - Records basic player and game data.
- replay.attributes.events
    - Records assorted player and game attributes from the lobby.

#### Input Events:

- replay.message.events
    - Records chat messages and pings.
- replay.game.events
    - Records every action of every person in the game.

#### Output Events:

- replay.tracker.events
    - Records important game events and game state updates.