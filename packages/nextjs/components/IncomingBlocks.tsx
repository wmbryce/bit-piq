import React from "react";
import BlobVisualizer from "./BlobVisualizer";
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
  return (
    <div className="flex flex-col items-start justify-start flex-1 max-h-[740px] pt-8 relative">
      <h1 className="text-lg font-medium font-slate-900 my-0">Incoming Blocks</h1>
      <p className="text-normal font-regular text-slate-500 my-0">Here are the latest blocks that have been mined.</p>
      <motion.ol layout className="flex flex-col space-y-4 mt-6 w-full overflow-y-auto">
        {loading ? (
          <motion.li key={12031923} className="flex flex-row bg-slate-50 p-4 w-full border border-slate-200 rounded-md">
            <Skeleton className="w-full h-full" />
          </motion.li>
        ) : (
          blocks.slice(0, 6).map((block: Block, index: number) => (
            <motion.li
              layoutId={`block-${block.number}`}
              key={`block-${block.number}`}
              initial={index === 0 ? { opacity: 0 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                default: { ease: "easeInOut", delay: index === 0 ? 0.28 : 0 },
                // delay: index === 0 ? 0.3 : 0, // Delay the fade-in of new block
                layout: { duration: 0.3 }, // Controls the sliding animation
              }}
              className="flex flex-row bg-slate-50 p-4 w-full border border-slate-200 rounded-md"
            >
              <div className="flex flex-col justify-between bg-slate-300 py-2 px-4 rounded-md min-w-[100px]">
                <h2 className="text-2xl font-bold text-slate-900 mb-0">#{String(block?.number)}</h2>
                <p className="text-md font-normal text-slate-700 whitespace-nowrap my-0">
                  {new Date(Number(block.timestamp) * 1000).toLocaleString("en-GB", {
                    timeZone: "GMT",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}{" "}
                  GMT
                </p>
              </div>
              <div className="flex flex-col ml-4">
                <div className="flex flex-row items-center px-4 bg-slate-300 rounded-md mb-2 w-[104%]">
                  <p className="text-sm font-semibold text-slate-600 my-0 uppercase">{block.miner.slice(0, -1)}</p>
                </div>
                <BlobVisualizer minted={true} />
              </div>
              <div className="flex flex-col bg-slate-300 rounded-md px-4 py-0 ml-2">
                <h1 className="text-6xl font-semibold text-slate-600 my-0 uppercase mt-[10px]">
                  {block.miner.slice(-1)}
                </h1>
              </div>
            </motion.li>
          ))
        )}
      </motion.ol>
      <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-slate-100 to-transparent via-transparent via-12%"></div>
    </div>
  );
};

export default IncomingBlocks;
