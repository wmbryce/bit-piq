import React, { useEffect, useState } from "react";

export interface Bet {
  hashPick: number;
  blockNumber: bigint;
  ethAmount: bigint;
  betId: bigint;
  claimed: boolean;
}

interface RecentBlocksProps {
  bets: Bet[];
  claimWinnings: any;
}

const RecentBets: React.FC<RecentBlocksProps> = ({ bets, claimWinnings }) => {
  const [loading, setLoading] = useState(false);
  const [recentBets, setRecentBets] = useState<any[]>([]);

  useEffect(() => {
    const combinedBets = [...recentBets, ...bets];
    // Overwrite existing recentBets with incoming bets by betId
    const dedupedBets = Array.from(new Map(combinedBets.map(bet => [bet.betId.toString(), bet])).values());

    setRecentBets(dedupedBets);
  }, [bets]);

  return (
    <div className="flex flex-col justify-start items-center bg-gray-200 rounded-md p-4 ml-8">
      <h1 className="text-2xl font-bold">Recent Bets</h1>
      <div className="flex flex-col">
        {[...(recentBets ?? [])]
          .reverse()
          .slice(0, 20)
          .map((bet: Bet) => (
            <div key={bet?.blockNumber}>
              {String(bet?.blockNumber)} - 0x{bet?.hashPick} - {String(bet?.ethAmount)} wei - {String(bet?.betId)} -{" "}
              {String(bet?.claimed)}
            </div>
          ))}
      </div>
      <button
        className="bg-black text-white px-4 py-2 mt-4 rounded-md hover:opacity-50"
        onClick={async () => {
          try {
            setLoading(true);
            const response = await claimWinnings({
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
  );
};

export default RecentBets;
