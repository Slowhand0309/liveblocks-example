'use client';

import { useMap } from '../providers/liveblocks';

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
  return (
    <>
      <div className="canvas">
        {Array.from(shapes, ([shapeId, shape]) => {
          return <Rectangle key={shapeId} shape={shape} />;
        })}
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
