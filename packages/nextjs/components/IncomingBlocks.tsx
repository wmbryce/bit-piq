import React, { useEffect, useState } from "react";
import BlobVisualizer from "./BlobVisualizer";
import Block from "./Block";
import Skeleton from "./Skeleton";
import { motion } from "framer-motion";

export type Block = {
  baseFeePerGas: bigint | null;
  blobGasUsed: bigint | null;
  difficulty: bigint;
  excessBlobGas: bigint | null;
  extraData: string;
  gasLimit: bigint;
  gasUsed: bigint;
  hash: string | null;
  logsBloom: string | null;
  miner: string;
  mixHash: string;
  nonce: string | null;
  number: bigint | null;
  parentBeaconBlockRoot: string | null;
  parentHash: string | null;
  receiptsRoot: string | null;
  sha3Uncles: string | null;
  size: bigint | null;
  stateRoot: string | null;
  timestamp: bigint | null;
  totalDifficulty: bigint;
  transactions: any[]; // Could be further typed based on transaction structure
  transactionsRoot: string | null;
  uncles: string[];
  withdrawals: any[]; // Could be further typed based on withdrawal structure
  withdrawalsRoot: string | null;
};

const IncomingBlocks: React.FC<{ blocks: Block[]; loading: boolean }> = ({ blocks, loading }) => {
  const [nextBlock, setNextBlock] = useState<bigint | null>(null);

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
        <Block block={{ number: nextBlock, timestamp: null, hash: null }} index={0} key={nextBlock} />
        {blocks.slice(0, 6).map((block: Block, index: number) => (
          <Block key={block.number} block={block} index={index + 1} />
        ))}
      </motion.ol>
      <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-slate-100 to-transparent via-transparent via-12%"></div>
    </div>
  );
};

export default IncomingBlocks;
