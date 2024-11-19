import React from "react";
import { useFetchBlocks } from "~~/hooks/scaffold-eth";

const RecentBlocks: React.FC = () => {
  const { blocks } = useFetchBlocks();

  return (
    <div className="flex flex-col justify-start items-center bg-gray-200 rounded-md p-4 ml-8">
      <h1 className="text-2xl font-bold">Recent Blocks</h1>
      <div className="flex flex-col">
        {blocks?.slice(0, 20).map((block: any) => (
          <div key={block?.number}>
            {String(block?.number)} - 0x{block?.hash.slice(65, 66)} -{" "}
            {new Date(Number(block?.timestamp) * 1000)?.toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBlocks;
