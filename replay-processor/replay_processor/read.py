import asyncio
import os
import pathlib
import sys

import sc2reader
from azure.storage.blob import BlobClient, ContainerClient
from dotenv import load_dotenv
from replay_processor.plugins.game_plugin import GameEventPlugin
from sc2reader.scripts.sc2json import toJSON


async def main() -> None:
    load_dotenv()

    print(f'Validate environment variables...')

    STORAGE_CONNECTION_STRING = os.getenv("STORAGE_CONNECTION_STRING")
    if STORAGE_CONNECTION_STRING is None:
        raise Exception(f'You attempted to run the container without providing the STORAGE_CONNECTION_STRING')
    
    STORAGE_CONTAINER_NAME_UNPROCESSED = os.getenv("STORAGE_CONTAINER_NAME_UNPROCESSED")
    if STORAGE_CONTAINER_NAME_UNPROCESSED is None:
        raise Exception(f'You attempted to run the container without providing the STORAGE_CONTAINER_NAME_UNPROCESSED')
    
    STORAGE_CONTAINER_NAME_PROCESSED = os.getenv("STORAGE_CONTAINER_NAME_PROCESSED")
    if STORAGE_CONTAINER_NAME_PROCESSED is None:
        raise Exception(f'You attempted to run the container without providing the STORAGE_CONTAINER_NAME_PROCESSED')

    container_client = ContainerClient.from_connection_string(STORAGE_CONNECTION_STRING, STORAGE_CONTAINER_NAME_UNPROCESSED)

    replays_unprocessed_local = []

    print(f"Fetching replays from: {STORAGE_CONTAINER_NAME_UNPROCESSED} container")
    blobs_generator = container_client.list_blobs()

    for blob in blobs_generator:
        
        blob_client = container_client.get_blob_client(blob.name)
        file_dir = pathlib.Path(__file__).parent.resolve()
        download_file_path = pathlib.Path(os.path.join(file_dir, '..', 'replays', blob.name)).resolve()

        print(f'Downloading replay from: {blob_client.url}\n saving to: {download_file_path}')
        with open(file=download_file_path, mode="wb") as download_file:
            download_file.write(blob_client.download_blob().readall())

        print(f'Saved local file: {download_file_path.name}')
        replays_unprocessed_local.append(download_file_path)

        blob_client.delete_blob()
        print(f'Deleted remote blob: {blob.name}')

    if len(replays_unprocessed_local) == 0:
        print(f'There were not any replays available in the container. Exiting early.')
        exit(0)

    replay_local_file_from_blob = replays_unprocessed_local[0]
    print(f"Loading replay file: {replay_local_file_from_blob}")

    sc2reader.engine.register_plugin(GameEventPlugin())
    replay = sc2reader.load_replay(str(replay_local_file_from_blob), load_map=True, load_level=4)

    factory = sc2reader.factories.SC2Factory()
    factory.register_plugin("Replay", toJSON(indent=4))
    replay_json = factory.load_replay(str(replay_local_file_from_blob))
    
    processed_file_name = f'{replay_local_file_from_blob.stem}.json'
    processed_replay_blob_client = BlobClient.from_connection_string(STORAGE_CONNECTION_STRING, STORAGE_CONTAINER_NAME_PROCESSED, processed_file_name)
    print(f'Uploading processed replay to: {processed_replay_blob_client.url}')
    processed_replay_blob_client.upload_blob(replay_json)
    print(f'Uploaded!')

if __name__ == '__main__':
    asyncio.run(main())

