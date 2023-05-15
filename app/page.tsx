'use client';

import { useMap } from '../providers/liveblocks';

const COLORS = ['#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777'];

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const getRandomColor = () => {
  return COLORS[getRandomInt(COLORS.length)];
};

const Rectangle = ({ shape }: { shape: any }) => {
  const { x, y, fill } = shape;

  return (
    <div
      className="rectangle"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        backgroundColor: fill ? fill : '#CCC',
      }}
    ></div>
  );
};

const Canvas = ({ shapes }: { shapes: any }) => {
  const insertRectangle = () => {
    const shapeId = Date.now().toString();
    const rectangle = {
      x: getRandomInt(300),
      y: getRandomInt(300),
      fill: getRandomColor(),
    };
    shapes.set(shapeId, rectangle);
  };
  return (
    <>
      <div className="canvas">
        {Array.from(shapes, ([shapeId, shape]) => {
          return <Rectangle key={shapeId} shape={shape} />;
        })}
      </div>
      <div className="toolbar">
        <button onClick={insertRectangle}>Rectangle</button>
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
