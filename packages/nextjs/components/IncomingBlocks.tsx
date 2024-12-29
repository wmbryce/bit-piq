import React, { useEffect, useState } from "react";
import Block from "./Block";
import { BlockType } from "@/types";
import { motion } from "framer-motion";

const IncomingBlocks: React.FC<{ blocks: BlockType[]; loading: boolean }> = ({ blocks, loading }) => {
  const [nextBlock, setNextBlock] = useState<bigint>(0n);

  useEffect(() => {
    if (blocks.length > 0) {
      setNextBlock(BigInt(Number(blocks[0]?.number ?? 0) + 1));
    }
  }, [blocks]);

  return (
    <div className="flex flex-col items-start justify-start flex-1 max-h-[740px] pt-8 relative">
      <h1 className="text-lg font-medium font-slate-900 my-0">Incoming Blocks</h1>
      <p className="text-normal font-regular text-slate-500 my-0">Here are the latest blocks that have been mined.</p>
      <motion.ol layout className="flex flex-col space-y-4 mt-6 w-full overflow-y-auto">
        <Block block={{ number: nextBlock }} index={0} key={nextBlock} />
        {blocks.slice(0, 6).map((block: BlockType, index: number) => (
          <Block key={block.number} block={block} index={index + 1} />
        ))}
      </motion.ol>
      <div className="absolute z-30 bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-slate-100 to-transparent via-transparent via-12%"></div>
    </div>
  );
};

export default IncomingBlocks;
