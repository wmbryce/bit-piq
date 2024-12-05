import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";

type BlobVisualizerProps = {
  minted: boolean;
  loading?: boolean;
};

const BlobVisualizer: React.FC<BlobVisualizerProps> = ({ minted, loading }) => {
  const [currentIndex, setCurrentIndex] = useState([0, 0]);
  const blobs = useMemo(() => new Array(32).fill(0).map((_, index) => new Array(4).fill(minted ? 1 : 0)), [minted]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    console.log("in useEffect", { completed, minted });
    if (!completed && !minted) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          console.log({ prev });
          if (prev[0] < 31) {
            blobs[prev[0]][prev[1]] = 1;
            return [prev[0] + 1, prev[1]];
          } else if (prev[1] < 3) {
            blobs[prev[0]][prev[1]] = 1;
            return [0, prev[1] + 1];
          } else {
            clearInterval(interval);
            setCompleted(true);
            return [32, 4];
          }
        });
      }, 1300);
    }

    // return () => clearInterval(interval);
  }, [minted]);

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
