import sc2reader
import sys
from sc2reader.events import *

class GameEventPlugin():
    # This seems required
    name = "GameEvevntPlugin"

    def handleEvent(self, event, replay):
        if (isinstance(event, TrackerEvent)):
            # print('Tracker Event:\t', event)
            if (isinstance(event, UnitBornEvent)):
                print(f'{event.unit.name} ({event.unit_id}) born at: {event.second}')
                # find closest building
                if (event.unit.owner):
                    buildings = [b for b in event.unit.owner.units if b.is_building is True and b.finished_at is not None]
                    print(f'candidate buildings: {len(buildings)}, {", ".join([f"name: {b.name} location: {b.location}" for b in buildings])}')

        if (isinstance(event, GameEvent)):
            print('Game Event:\t', event)

        if (event.name == "BasicCommandEvent"):
            if (event.ability.is_build is True):
                print(f"{event.ability.name} at time: {event.second} with build_time: {event.ability.build_time}")
                # get all completed buildings
                buildings = [b for b in event.player.units if b.is_building is True and b.finished_at is not None]
                # if (event.ability.name == "TrainSCV"):
                    # print(len(buildings))

def main():
    replay_file_path = sys.argv[1]
    print(f"Loading replay file: {replay_file_path}")

    sc2reader.engine.register_plugin(GameEventPlugin())

    replay = sc2reader.load_replay(replay_file_path, load_map=True, load_level=4)

if __name__ == '__main__':
    main()

