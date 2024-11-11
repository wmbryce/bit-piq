"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useFetchBlocks, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  //   const { address: connectedAddress } = useAccount();
  const [hashPick, setHashPick] = useState<string[]>(["0", "0", "0", "0"]);
  const [tickets, setTickets] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { writeContractAsync: writePlaceBet } = useScaffoldWriteContract("BitPiqPool");

  const { writeContractAsync: writeClaimWinnings } = useScaffoldWriteContract("BitPiqPool");

  const { data: bets } = useScaffoldReadContract({
    contractName: "BitPiqPool",
    functionName: "getBets",
  });

  const handleToggleHashPick = (index: number) => {
    setHashPick(prev => {
      const newHashPick = [...prev];
      newHashPick[index] = newHashPick[index] === "0" ? "1" : "0";
      return newHashPick;
    });
  };

  const { blocks, transactionReceipts, currentPage, totalBlocks, error } = useFetchBlocks();

  console.log("bets:", bets, "blocks:", blocks);
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
          <h2 className="mt-4">Wager (wei)</h2>
          <input
            type="number"
            value={tickets}
            onChange={e => {
              if (e.target.value > "-1") {
                setTickets(parseInt(e.target.value));
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
                  args: [hashPickValue, BigInt(tickets)],
                  value: BigInt(tickets),
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
        <div className="flex flex-col justify-start items-center bg-gray-200 rounded-md p-4 ml-8">
          <h1 className="text-2xl font-bold">Recent Bets</h1>
          <div className="flex flex-col justify-between flex-1">
            <div className="flex flex-col">
              {[...(bets ?? [])]
                .reverse()
                .slice(0, 20)
                .map((bet: any) => (
                  <div key={bet?.blockNumber}>
                    {String(bet?.blockNumber)} - 0x{bet?.hashPick} - {String(bet?.tickets)} wei
                  </div>
                ))}
            </div>
            <button
              className="bg-black text-white px-4 py-2 mt-4 rounded-md hover:opacity-50"
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await writeClaimWinnings({
                    functionName: "claimWinnings",
                  });
                  console.log("Transaction successful:", response);
                } catch (error) {
                  console.error("Error placing bet:", error);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Loading..." : "Claim Winnings"}
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-start items-center bg-gray-200 rounded-md p-4 ml-8">
          <h1 className="text-2xl font-bold">Recent Blocks</h1>
          <div className="flex flex-col">
            {blocks?.map((block: any) => (
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
      </div>
    </div>
  );
};

export default Home;
