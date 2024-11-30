import React from "react";
import BlobVisualizer from "./BlobVisualizer";

type Block = {
  baseFeePerGas: bigint;
  blobGasUsed: bigint;
  difficulty: bigint;
  excessBlobGas: bigint;
  extraData: string;
  gasLimit: bigint;
  gasUsed: bigint;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: bigint;
  parentBeaconBlockRoot: string;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: bigint;
  stateRoot: string;
  timestamp: bigint;
  totalDifficulty: bigint;
  transactions: any[]; // Could be further typed based on transaction structure
  transactionsRoot: string;
  uncles: string[];
  withdrawals: any[]; // Could be further typed based on withdrawal structure
  withdrawalsRoot: string;
};

const IncomingBlocks: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
  console.log("incoming blocks", { blocks });

  return (
    <div className="flex flex-col items-start justify-start flex-1 py-8">
      <h1 className="text-lg font-medium font-slate-900">Incoming Blocks</h1>
      <p className="text-normal font-regular text-slate-700">Here are the latest blocks that have been mined.</p>
      <div className="flex flex-col space-y-4 mt-4 w-full">
        {blocks.slice(0, 5).map((block: Block) => (
          <div key={block.number} className="flex flex-row bg-slate-50 p-4 w-full border border-slate-200 rounded-md">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomingBlocks;
