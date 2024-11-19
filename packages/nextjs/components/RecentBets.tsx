import React, { useState } from "react";

interface RecentBlocksProps {
  bets: any[];
  claimWinnings: any;
}

const RecentBets: React.FC<RecentBlocksProps> = ({ bets, claimWinnings }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col justify-start items-center bg-gray-200 rounded-md p-4 ml-8">
      <h1 className="text-2xl font-bold">Recent Bets</h1>
      <div className="flex flex-col">
        {[...(bets ?? [])]
          .reverse()
          .slice(0, 20)
          .map((bet: any) => (
            <div key={bet?.blockNumber}>
              {String(bet?.blockNumber)} - 0x{bet?.hashPick} - {String(bet?.tickets)} wei - {bet?.status}
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
