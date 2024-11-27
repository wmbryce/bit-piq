import React, { useEffect, useState } from "react";

interface RecentBlocksProps {
  bets: any[];
  evaluateBets: any;
}

const RecentBets: React.FC<RecentBlocksProps> = ({ bets, evaluateBets }) => {
  const [loading, setLoading] = useState(false);
  const [recentBets, setRecentBets] = useState<any[]>([]);

  useEffect(() => {
    setRecentBets(Array.from(new Set([...recentBets, ...bets])));
  }, [bets]);

  console.log("recentBets", recentBets);
  return (
    <div className="flex flex-col justify-start items-center bg-gray-200 rounded-md p-4 ml-8">
      <h1 className="text-2xl font-bold">Recent Bets</h1>
      <div className="flex flex-col">
        {[...(recentBets ?? [])]
          .reverse()
          .slice(0, 20)
          .map((bet: any) => (
            <div key={bet?.blockNumber}>
              {String(bet?.bet?.blockNumber)} - 0x{bet?.bet?.hashPick} - {String(bet?.bet?.ethAmount)} wei -{" "}
              {String(bet?.betId)}
            </div>
          ))}
      </div>
      <button
        className="bg-black text-white px-4 py-2 mt-4 rounded-md hover:opacity-50"
        onClick={async () => {
          try {
            setLoading(true);
            const response = await evaluateBets({
              functionName: "evaluateBets",
              args: [bets.map(bet => bet.betId)],
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
