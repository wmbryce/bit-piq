import React, { useEffect, useMemo } from "react";
import { cn } from "@/utils/cn";

type BlobVisualizerProps = {
  minted: boolean;
};

const BlobVisualizer: React.FC<BlobVisualizerProps> = ({ minted }) => {
  const blobs = useMemo(() => new Array(32).fill(0).map((_, index) => new Array(4).fill(minted ? 1 : 0)), [minted]);

  return (
    <div className="flex flex-row gap-[2px]">
      {blobs.map((columns, xIndex) => (
        <div key={xIndex} className="flex flex-col gap-[2px]">
          {columns.map((value, yIndex) => (
            <div key={xIndex + yIndex} className={cn("w-3 h-3", value === 1 ? "bg-slate-800" : "bg-slate-200")} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BlobVisualizer;
