'use client';

import { useState } from 'react';
import { useMap, useMyPresence, useOthers } from '../providers/liveblocks';
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
  const { x, y, fill } = shape;

  return (
    <div
      className="rectangle"
      onPointerDown={(e) => onShapePointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        backgroundColor: fill ? fill : '#CCC',
        borderColor: selectionColor || 'transparent',
      }}
    ></div>
  );
};

const Canvas = ({ shapes }: { shapes: any }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [{ selectedShape }, setPresence] = useMyPresence();
  const others = useOthers();

  const insertRectangle = () => {
    const shapeId = Date.now().toString();
    const rectangle = {
      x: getRandomInt(300),
      y: getRandomInt(300),
      fill: getRandomColor(),
    };
    shapes.set(shapeId, rectangle);
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

    if (isDragging) {
      const shape = shapes.get(selectedShape);
      if (shape) {
        shapes.set(selectedShape, {
          ...shape,
          x: e.clientX - 50,
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
