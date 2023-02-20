from sc2reader.events import *


class GameEventPlugin():
    # This seems required
    name = "GameEvevntPlugin"

    def handleEvent(self, event, replay):
        if (isinstance(event, TrackerEvent)):
            # print('Tracker Event:\t', event.name, event)
            if (isinstance(event, UnitDoneEvent)):
                if (event.unit.owner and event.unit.owner.play_race == "Terran"):
                    pass
                    # print(f"{event.unit.name} done at {event.second}")
                
            if (isinstance(event, UnitBornEvent)):
                if (event.unit.owner and event.unit.owner.play_race == "Terran"):
                    pass
                    # print(f'{event.unit.name} ({event.unit_id}) born at: {event.second}')
                    # find closest building
                    # buildings = [b for b in event.unit.owner.units if b.is_building is True and b.finished_at is not None]
                    # print(f'candidate buildings: {len(buildings)}, {", ".join([f"name: {b.name} location: {b.location}" for b in buildings])}')

        if (isinstance(event, GameEvent)):
            # print('Game Event:\t', event.name, event)
        
            if (isinstance(event, BasicCommandEvent)):
                if (event.ability.is_build is True):
                    pass
                    # print(f"{event.ability.name} at time: {event.second} with build_time: {event.ability.build_time}")
                    # get all completed buildings
                    # buildings = [b for b in event.player.units if b.is_building is True and b.finished_at is not None]
                    # if (event.ability.name == "TrainSCV"):
                        # print(len(buildings))