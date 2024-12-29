import React from "react";
import BlobVisualizer from "./BlobVisualizer";
import Skeleton from "./Skeleton";
import { BlockType } from "@/types";
import { motion } from "framer-motion";

type BlockProps = {
  block: BlockType | { number: bigint };
  index: number;
};

const Block: React.FC<BlockProps> = ({ block, index }) => {
  const isBlockType = (block: BlockType | { number: bigint }): block is BlockType => {
    return typeof block === "object" && "timestamp" in block && "hash" in block;
  };

  return (
    <motion.li
      layoutId={`block-${block.number}`}
      key={`block-${block.number}`}
      initial={index === 0 ? { opacity: 0 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        default: { ease: "easeInOut", delay: index === 0 ? 0.28 : 0 },
        layout: { duration: 0.3 }, // Controls the sliding animation
      }}
      className="flex flex-row bg-slate-50 p-4 w-full border border-slate-200 rounded-md"
    >
      <div className="flex flex-col justify-between bg-slate-300 py-2 px-4 rounded-md min-w-[100px]">
        <h2 className="text-2xl font-bold text-slate-900 mb-0">#{String(block?.number)}</h2>
        {isBlockType(block) ? (
          <p className="text-md font-normal text-slate-700 whitespace-nowrap my-0">
            {new Date(Number(block?.timestamp) * 1000).toLocaleString("en-GB", {
              timeZone: "GMT",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}{" "}
            GMT
          </p>
        ) : (
          <Skeleton className="w-[100px] h-[30%]" />
        )}
      </div>
      <div className="flex flex-col ml-4 w-[506px]">
        <div className="flex flex-row items-center pl-2 bg-slate-300 rounded-md mb-2 w-[104%] z-10">
          <p className="text-xs font-semibold text-slate-600 my-1 uppercase w-[108%] h-[16px]">
            {isBlockType(block) && block?.hash?.slice(0, -1)}
          </p>
        </div>
        <BlobVisualizer minted={index !== 0} />
      </div>
      <div className="flex flex-col bg-slate-300 rounded-md p-4 ml-2 w-[74px]">
        {isBlockType(block) ? (
          <h1 className="text-6xl font-semibold text-slate-600 my-0 uppercase">{block?.hash?.slice(-1)}</h1>
        ) : (
          <Skeleton className="w-[100%] h-[100%]" />
        )}
      </div>
    </motion.li>
  );
};

export default Block;
