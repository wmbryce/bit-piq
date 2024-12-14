import { useEffect, useState } from "react";
import BetAmountPicker from "./BetAmountPicker";
import HashPicker from "./HashPicker";
import { cn } from "@/utils/cn";

enum BetManagerTabEnum {
  PLACE_BET = "placeBet",
  VIEW_BETS = "viewBets",
}

function setBetManagerActiveTab(activeTab: BetManagerTabEnum) {
  localStorage.setItem("betManagerActiveTab", activeTab);
}

/**
 * Converts a string or string array to a numeric value.
 * - If `s` is a string, the function parses it as a hexadecimal character.
 * - If `s` is a string array, the function joins the elements and parses the result as a binary number.
 * @param s - A single string or an array of strings.
 * @returns The parsed numeric value.
 */
function getHashPickValue(s: string | string[]): number {
  if (typeof s === "string") {
    return parseInt(s, 16);
  }
  return parseInt(s.join(""), 2);
}

const BetManager = ({ writePlaceBet }: { writePlaceBet: any }) => {
  const [activeTab, setActiveTab] = useState<BetManagerTabEnum>(() => {
    return (localStorage.getItem("betManagerActiveTab") as BetManagerTabEnum) || BetManagerTabEnum.PLACE_BET;
  });
  const [loading, setLoading] = useState(false);
  // const [betAmountInUsd, setBetAmountInUsd] = useState(0);
  // const [betAmountInEth, setBetAmountInEth] = useState(0);
  const [betAmountInWei, setBetAmountInWei] = useState(0);
  const [hashPick, setHashPick] = useState<string | string[]>("0");

  useEffect(() => {
    setBetManagerActiveTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (newTab: BetManagerTabEnum) => {
    setActiveTab(newTab);
  };

  return (
    <div className="border-[1px] border-slate-200 rounded-md shadow-md bg-slate-50 z-40 w-[480px] h-fit mt-8">
      <div className="border-b-[1px] border-gray-200 flex items-center pt-4 px-4 gap-8">
        <button
          className={cn(
            "text-sm py-0.5 font-sans px-1 text-slate-500",
            activeTab === BetManagerTabEnum.PLACE_BET
              ? "active border-b-[2px] text-slate-800 border-slate-800 font-medium"
              : "",
          )}
          onClick={() => handleTabChange(BetManagerTabEnum.PLACE_BET)}
        >
          Place Bet
        </button>
        <button
          className={cn(
            "text-sm py-0.5 text-slate-500 px-1",
            activeTab === BetManagerTabEnum.VIEW_BETS
              ? "active border-b-[2px] text-slate-800 border-slate-800 font-medium"
              : "",
          )}
          onClick={() => handleTabChange(BetManagerTabEnum.VIEW_BETS)}
        >
          View Bets
        </button>
      </div>
      <div className="p-4">
        {activeTab === BetManagerTabEnum.PLACE_BET && (
          <div className="flex flex-col justify-start items-center rounded-md gap-8">
            <HashPicker setHashPick={setHashPick} />
            <BetAmountPicker />
            <div className="w-full mt-6">
              {/* Key-Value Lines */}
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Block Number</span>
                <span className="text-sm text-gray-600">12345678</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Wager Value</span>
                <span className="text-sm text-gray-600">$120,392.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Possible Winnings</span>
                <span className="text-sm text-gray-600">$800.00</span>
              </div>
            </div>
            <div className="flex w-full justify-end items-center">
              <button
                className="bg-black text-white px-4 py-2 mt-6 rounded-md hover:opacity-50"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const hashPickValue = getHashPickValue(hashPick);
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
