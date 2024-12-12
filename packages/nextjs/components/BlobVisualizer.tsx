import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";

type BlobVisualizerProps = {
  minted: boolean;
  loading?: boolean;
};

const BlobVisualizer: React.FC<BlobVisualizerProps> = ({ minted, loading }) => {
  const [currentIndex, setCurrentIndex] = useState([0, 0]);
  const [blobs, setBlobs] = useState(() => new Array(36).fill(0).map(() => new Array(4).fill(minted ? 1 : 0)));
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (minted) {
      // When minted, fill all blobs immediately
      setBlobs(new Array(36).fill(0).map(() => new Array(4).fill(1)));
      setCompleted(true);
      setCurrentIndex([36, 4]);
      return;
    }
    if (!completed && !minted) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          const [x, y] = prev;
          if (x < 35) {
            setBlobs(currentBlobs => {
              const newBlobs = currentBlobs.map(row => [...row]);
              newBlobs[x][y] = 1;
              return newBlobs;
            });
            return [x + 1, y];
          } else if (y < 3) {
            setBlobs(currentBlobs => {
              const newBlobs = currentBlobs.map(row => [...row]);
              newBlobs[x][y] = 1;
              return newBlobs;
            });
            return [0, y + 1];
          } else {
            clearInterval(interval);
            setCompleted(true);
            setBlobs(new Array(36).fill(0).map((_, index) => new Array(4).fill(1)));
            return [36, 4];
          }
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [minted, completed]);

  if (!minted) {
    console.log({ blobs, currentIndex });
  }

  return (
    <div className="flex flex-row gap-[2px]">
      {blobs.map((columns, xIndex) => (
        <div key={xIndex} className="flex flex-col gap-[2px]">
          {columns.map((_, yIndex) => (
            <div
              key={xIndex + yIndex}
              className={cn(
                "w-3 h-3 transition-all duration-200",
                blobs[xIndex][yIndex] === 1 ? "bg-slate-800" : "bg-slate-100",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BlobVisualizer;
