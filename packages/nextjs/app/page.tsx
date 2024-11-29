"use client";

import { useState } from "react";
import RecentBets from "../components/RecentBets";
import RecentBlocks from "../components/RecentBlocks";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [hashPick, setHashPick] = useState<string[]>(["0", "0", "0", "0"]);
  const [betAmountInWei, setBetAmountInWei] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { writeContractAsync: writePlaceBet } = useScaffoldWriteContract("BitPiq");
  const { writeContractAsync: writeClaimWinnings } = useScaffoldWriteContract("BitPiq");

  const { data: bets } = useScaffoldReadContract({
    contractName: "BitPiq",
    functionName: "getBets",
    args: [connectedAddress],
  });

  const handleToggleHashPick = (index: number) => {
    setHashPick(prev => {
      const newHashPick = [...prev];
      newHashPick[index] = newHashPick[index] === "0" ? "1" : "0";
      return newHashPick;
    });
  };

  // const { blocks, transactionReceipts, currentPage, totalBlocks, error } = useFetchBlocks();

  return (
    <div className="flex flex-col items-center justify-start flex-1 py-8">
      <h1 className="text-4xl font-bold">BIT PIQ</h1>
      <p>
        Welcome to the hash betting game. Every 10 minutes a new block is mined. Bit piq, allows you to bet on the last
        four bits of that block hash.
      </p>
      <div className="flex flex-row justify-between px-8">
        <div className="flex flex-col justify-start items-center bg-gray-200 rounded-md p-4">
          <h1 className="text-2xl font-bold">Place Bets</h1>
          <div className="flex flex-row">
            {hashPick.map((pick, index) => (
              <button
                key={index}
                className="w-36 h-60 bg-gray-300 mx-2 rounded-md text-6xl font-bold"
                onClick={() => handleToggleHashPick(index)}
              >
                {pick}
              </button>
            ))}
          </div>
          <h2 className="mt-4">Wager (ETH)</h2>
          <input
            type="number"
            value={betAmountInWei}
            onChange={e => {
              if (e.target.value > "-1") {
                setBetAmountInWei(parseFloat(e.target.value));
              }
            }}
            className="w-36 h-40 pl-12 bg-gray-300 mx-2 rounded-md text-6xl font-bold"
          />
          <button
            className="bg-black text-white px-4 py-2 mt-4 rounded-md hover:opacity-50"
            onClick={async () => {
              try {
                setLoading(true);
                const hashPickValue = parseInt(hashPick.join(""), 2);
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
