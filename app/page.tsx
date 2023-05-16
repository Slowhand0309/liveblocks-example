'use client';

import { LiveObject } from '@liveblocks/client';
import { useEffect, useState } from 'react';
import {
  useMap,
  useMyPresence,
  useOthers,
  useRoom,
  useUpdateMyPresence,
} from '../providers/liveblocks';
const COLORS = ['#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777'];

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const getRandomColor = () => {
  return COLORS[getRandomInt(COLORS.length)];
};

const Rectangle = ({
  shape,
  id,
  onShapePointerDown,
  selectionColor,
}: {
  shape: any;
  id: string;
  onShapePointerDown: (e: any, id: string) => void;
  selectionColor: string | undefined;
}) => {
  const room = useRoom();
  const [{ x, y, fill, sub }, setShapeData] = useState(shape.toObject());
  const [name, setName] = useState(sub.get('name'));
  useEffect(() => {
    const onChange = () => {
      setShapeData(shape.toObject());
    };

    return room.subscribe(shape, onChange);
  }, [room, shape]);

  useEffect(() => {
    const onChange = () => {
      setName(sub.get('name'));
    };

    return room.subscribe(sub, onChange);
  }, []);
  return (
    <div
      className="rectangle"
      onPointerDown={(e) => onShapePointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        backgroundColor: fill ? fill : '#CCC',
        borderColor: selectionColor || 'transparent',
      }}
    >
      <input
        value={name}
        onChange={(e) => sub.update({ name: e.target.value })}
      />
    </div>
  );
};

const Cursor = ({ x, y }: { x: number; y: number }) => {
  return (
    <img
      style={{
        position: 'absolute',
        transform: `translate(${x}px, ${y}px)`,
      }}
      src="https://liveblocks.io/images/cursor.svg"
    />
  );
};

const Canvas = ({ shapes }: { shapes: any }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [{ selectedShape }, setPresence] = useMyPresence();
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  const insertRectangle = () => {
    const shapeId = Date.now().toString();
    const shape = new LiveObject({
      x: getRandomInt(300),
      y: getRandomInt(300),
      fill: getRandomColor(),
      sub: new LiveObject({ name: '' }),
    });
    shapes.set(shapeId, shape);
  };

  const onShapePointerDown = (e: any, shapeId: string) => {
    e.stopPropagation();
    setPresence({ selectedShape: shapeId });
    setIsDragging(true);
  };

  const deleteRectangle = () => {
    shapes.delete(selectedShape);
    setPresence({ selectedShape: null });
  };

  const onCanvasPointerUp = (e: any) => {
    if (!isDragging) {
      setPresence({ selectedShape: null });
    }

    setIsDragging(false);
  };

  const onCanvasPointerMove = (e: any) => {
    e.preventDefault();
    updateMyPresence({ cursor: { x: e.clientX, y: e.clientY } });
    if (isDragging) {
      const shape: LiveObject<{
        x: number;
        y: number;
        fill: string;
      }> = shapes.get(selectedShape);
      if (shape) {
        shape.update({
          x: e.clientX - 100,
          y: e.clientY - 50,
        });
      }
    }
  };

  return (
    <>
      <div
        className="canvas"
        onPointerDown={(e) => setPresence({ selectedShape: null })}
        onPointerMove={onCanvasPointerMove}
        onPointerUp={onCanvasPointerUp}
        onPointerLeave={() => updateMyPresence({ cursor: null })}
      >
        {Array.from(shapes, ([shapeId, shape]) => {
          const selectionColor =
            selectedShape === shapeId
              ? 'blue'
              : others.some((user) => user.presence?.selectedShape === shapeId)
              ? 'green'
              : undefined;
          return (
            <Rectangle
              key={shapeId}
              shape={shape}
              id={shapeId}
              onShapePointerDown={onShapePointerDown}
              selectionColor={selectionColor}
            />
          );
        })}
        {others.map(({ connectionId, presence }) =>
          presence.cursor ? (
            <Cursor
              key={connectionId}
              x={(presence.cursor as any).x}
              y={(presence.cursor as any).y}
            />
          ) : null
        )}
      </div>
      <div className="toolbar">
        <button onClick={insertRectangle}>Rectangle</button>
        <button onClick={deleteRectangle} disabled={selectedShape == null}>
          Delete
        </button>
      </div>
    </>
  );
};

const PageWrapper = () => {
  const shapes = useMap('shapes');

  if (shapes == null) {
    return <div className="loading">Loading</div>;
  }
  return <Canvas shapes={shapes} />;
};

const Page = () => {
  return <PageWrapper />;
};
export default Page;
