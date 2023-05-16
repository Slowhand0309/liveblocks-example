'use client';

import { LiveMap } from '@liveblocks/client';
import { RoomProvider } from '../providers/liveblocks';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body>
        <RoomProvider
          id="react-whiteboard-app2"
          initialPresence={{}}
          initialStorage={{
            shapes: new LiveMap(),
          }}
        >
          <div>{children}</div>
        </RoomProvider>
      </body>
    </html>
  );
}
