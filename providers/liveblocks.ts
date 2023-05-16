import { createClient } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY ?? '',
});

export const { RoomProvider, useMap, useOthers, useMyPresence } =
  createRoomContext(client);
