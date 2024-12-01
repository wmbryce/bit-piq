"use client";

import BetManager from "../components/BetManager";
import IncomingBlocks from "../components/IncomingBlocks";
import type { Block } from "../components/IncomingBlocks";
import { useFetchBlocks, useScaffoldReadContract, useScaffoldWriteContract } from "@/hooks/scaffold-eth";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { writeContractAsync: writePlaceBet } = useScaffoldWriteContract("BitPiq");
  const { writeContractAsync: writeClaimWinnings } = useScaffoldWriteContract("BitPiq");

  const { data: bets } = useScaffoldReadContract({
    contractName: "BitPiq",
    functionName: "getBets",
    args: [connectedAddress],
  });

  const { blocks } = useFetchBlocks();

  return (
    <div className="flex flex-col items-start justify-start flex-1 py-8">
      <h1 className="text-4xl font-bold tracking-tighter font-slate-900">Bit Piq</h1>
      <p className="text-normal font-regular text-slate-700">
        Welcome to the hash betting game. Every 10 minutes a new block is mined. Bit piq, allows you to bet on the last
        four bits of that block hash.
      </p>
      <div className="flex flex-row justify-between">
        <div className="flex flex-1 min-w-[600px] px-4">
          <IncomingBlocks blocks={blocks as Block[]} loading={!blocks} />
        </div>
        <div className="flex flex-1">
          <BetManager writePlaceBet={writePlaceBet} />
        </div>
      </div>
    </div>
  );
};

export default Home;
