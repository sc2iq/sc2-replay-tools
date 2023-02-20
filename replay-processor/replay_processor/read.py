import asyncio
import sc2reader
import os
import sys
from sc2reader.events import *
from sc2reader.scripts.sc2json import toJSON
from dotenv import load_dotenv
from azure.storage.blob import ContainerClient
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

async def main() -> None:
    load_dotenv()

    print(f'Validate environment variables...')

    STORAGE_CONNECTION_STRING = os.getenv("STORAGE_CONNECTION_STRING")
    if STORAGE_CONNECTION_STRING is None:
        raise Exception(f'You attempted to run the container without providing the STORAGE_CONNECTION_STRING')
    
    STORAGE_CONTAINER_NAME = os.getenv("STORAGE_CONTAINER_NAME")
    if STORAGE_CONTAINER_NAME is None:
        raise Exception(f'You attempted to run the container without providing the STORAGE_CONTAINER_NAME')

    replay_file_path = sys.argv[1]
    print(f"Loading replay file: {replay_file_path}")

    container_client = ContainerClient.from_connection_string(STORAGE_CONNECTION_STRING, STORAGE_CONTAINER_NAME)
    blobs_generator = container_client.list_blobs()
    for blob in blobs_generator:
        print(blob.name)
        blob_client = container_client.get_blob_client(blob.name)
        print(blob_client.url)

    sc2reader.engine.register_plugin(GameEventPlugin())

    replay = sc2reader.load_replay(replay_file_path, load_map=True, load_level=4)
    factory = sc2reader.factories.SC2Factory()
    factory.register_plugin("Replay", toJSON(indent=4))
    replay_json = factory.load_replay(replay_file_path)
    
    print(replay_json)

if __name__ == '__main__':
    asyncio.run(main())

