import { useState } from "react";
import BetAmountPicker from "./BetAmountPicker";
import HashPicker from "./HashPicker";

const BetManager = ({ writePlaceBet }: { writePlaceBet: any }) => {
  const [activeTab, setActiveTab] = useState("placeBet");
  const [loading, setLoading] = useState(false);
  const [betAmountInWei, setBetAmountInWei] = useState(0);
  const [binaryHashPick, setBinaryHashPick] = useState<string[]>([]);

  return (
    <div className="card">
      <div className="card-header">
        <button className={`tab ${activeTab === "placeBet" ? "active" : ""}`} onClick={() => setActiveTab("placeBet")}>
          Place Bet
        </button>
        <button className={`tab ${activeTab === "viewBets" ? "active" : ""}`} onClick={() => setActiveTab("viewBets")}>
          View Bets
        </button>
      </div>
      <div className="card-body">
        {activeTab === "placeBet" && (
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
        )}
        {activeTab === "viewBets" && <div>View Bets Content</div>}
      </div>
    </div>
  );
};

export default BetManager;
