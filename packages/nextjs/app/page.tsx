"use client";

import { useState } from "react";
import BetAmountPicker from "../components/BetAmountPicker";
import HashPicker from "../components/HashPicker";
import RecentBets from "../components/RecentBets";
import RecentBlocks from "../components/RecentBlocks";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [binaryHashPick, setBinaryHashPick] = useState<string[]>(["0", "0", "0", "0"]);
  const [betAmountInWei, setBetAmountInWei] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const { writeContractAsync: writePlaceBet } = useScaffoldWriteContract("BitPiq");
  const { writeContractAsync: writeClaimWinnings } = useScaffoldWriteContract("BitPiq");

  const { data: bets } = useScaffoldReadContract({
    contractName: "BitPiq",
    functionName: "getBets",
    args: [connectedAddress],
  });

  // const { blocks, transactionReceipts, currentPage, totalBlocks, error } = useFetchBlocks();

  return (
    <div className="flex flex-col items-start justify-start flex-1 py-8">
      <h1 className="text-4xl font-bold tracking-tighter">Bit Piq</h1>
      <p>
        Welcome to the hash betting game. Every 10 minutes a new block is mined. Bit piq, allows you to bet on the last
        four bits of that block hash.
      </p>
      <div className="flex flex-row justify-between px-8">
        <div className="flex flex-col justify-start items-center bg-gray-200 rounded-md p-4">
          <h1 className="text-2xl font-bold">Place Bets</h1>
          <HashPicker />
          <h2 className="mt-4">Wager (ETH)</h2>
          <BetAmountPicker setBetAmountInWei={setBetAmountInWei} />
          <button
            className="bg-black text-white px-4 py-2 mt-4 rounded-md hover:opacity-50"
            onClick={async () => {
              try {
                setLoading(true);
                const hashPickValue = parseInt(binaryHashPick.join(""), 2);
                const response = await writePlaceBet({
                  functionName: "placeBet",
                  args: [hashPickValue],
                  value: BigInt(betAmountInWei),
                });
                console.log("Transaction successful:", response);
              } catch (error) {
                console.error("Error placing bet:", error);
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Loading..." : "Place Bet"}
          </button>
        </div>
        <RecentBets bets={bets ? [...bets] : []} claimWinnings={writeClaimWinnings} />
        <RecentBlocks />
      </div>
    </div>
  );
};

export default Home;
