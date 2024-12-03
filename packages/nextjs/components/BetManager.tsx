import { useEffect, useState } from "react";
import BetAmountPicker from "./BetAmountPicker";
import HashPicker from "./HashPicker";

enum BetManagerTabEnum {
  PLACE_BET = "placeBet",
  VIEW_BETS = "viewBets",
}

function setBetManagerActiveTab(activeTab: BetManagerTabEnum) {
  localStorage.setItem("betManagerActiveTab", activeTab);
}

const BetManager = ({ writePlaceBet }: { writePlaceBet: any }) => {
  const [activeTab, setActiveTab] = useState<BetManagerTabEnum>(() => {
    return (localStorage.getItem("betManagerActiveTab") as BetManagerTabEnum) || BetManagerTabEnum.PLACE_BET;
  });
  const [loading, setLoading] = useState(false);
  const [betAmountInWei, setBetAmountInWei] = useState(0);
  const [binaryHashPick, setBinaryHashPick] = useState<string[]>([]);

  useEffect(() => {
    setBetManagerActiveTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (newTab: BetManagerTabEnum) => {
    setActiveTab(newTab);
  };

  return (
    <div className="card border-2 border-gray-300 rounded-md p-4 shadow-md">
      <div className="card-header border-b-2 border-gray-400 -mx-4 px-4 pb-4 mb-2 flex items-center space-x-4">
        <button
          className={`tab text-sm py-0.5 px-4 ${activeTab === BetManagerTabEnum.PLACE_BET ? "active font-bold" : ""}`}
          onClick={() => handleTabChange(BetManagerTabEnum.PLACE_BET)}
        >
          Place Bet
        </button>
        <div className="h-6 w-px bg-gray-300"></div>
        <button
          className={`tab text-sm py-0.5 px-4 ${activeTab === BetManagerTabEnum.VIEW_BETS ? "active font-bold" : ""}`}
          onClick={() => handleTabChange(BetManagerTabEnum.VIEW_BETS)}
        >
          View Bets
        </button>
      </div>
      <div className="card-body">
        {activeTab === BetManagerTabEnum.PLACE_BET && (
          <div className="flex flex-col justify-start items-center rounded-md p-4">
            <HashPicker />
            <div className="h-4"></div>
            <BetAmountPicker />
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
        {activeTab === BetManagerTabEnum.VIEW_BETS && (
          <div className="flex flex-col justify-start items-center bg-gray-200 rounded-md p-4">
            <h1 className="text-2xl font-bold">View Bets</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetManager;
