import { useEffect, useReducer, useState } from "react";
import BetAmountPicker from "./BetAmountPicker";
import HashPicker from "./HashPicker";
import { cn } from "@/utils/cn";

type BetAmountAction =
  | { type: "SET_USD"; payload: number }
  | { type: "SET_ETH"; payload: number }
  | { type: "SET_WEI"; payload: number }
  | { type: "SET_ETH_PRICE"; payload: number };

export class BetAmount {
  public usd: number;
  public eth: number;
  public wei: number;
  public ethPrice: number;

  constructor(ethPrice: number, usd = 0, eth = 0, wei = 0) {
    this.ethPrice = ethPrice;
    this.usd = usd;
    this.eth = eth;
    this.wei = wei;
  }

  setEthPrice(value: number) {
    this.ethPrice = value;
    this.usd = this.eth * value;
  }

  setUsd(value: number) {
    this.usd = value;
    this.eth = value / this.ethPrice;
    this.wei = this.eth * 1e18;
  }

  setEth(value: number) {
    this.eth = value;
    this.usd = value * this.ethPrice;
    this.wei = this.eth * 1e18;
  }

  setWei(value: number) {
    this.wei = value;
    this.eth = value / 1e18;
    this.usd = this.eth * this.ethPrice;
  }
}

type BetAmountState = BetAmount;

const betAmountReducer = (state: BetAmountState, action: BetAmountAction): BetAmountState => {
  switch (action.type) {
    case "SET_USD":
      const newUsdState = new BetAmount(state.ethPrice, action.payload, state.eth, state.wei);
      newUsdState.setUsd(action.payload);
      return newUsdState;
    case "SET_ETH":
      const newEthState = new BetAmount(state.ethPrice, state.usd, action.payload, state.wei);
      newEthState.setEth(action.payload);
      return newEthState;
    case "SET_WEI":
      const newWeiState = new BetAmount(state.ethPrice, state.usd, state.eth, action.payload);
      newWeiState.setWei(action.payload);
      return newWeiState;
    case "SET_ETH_PRICE":
      const newPriceState = new BetAmount(action.payload, state.usd, state.eth, state.wei);
      newPriceState.setEthPrice(action.payload);
      return newPriceState;
    default:
      throw new Error(`Unknown action type: ${action}`);
  }
};

const useBetAmount = (initialEthPrice: number) => {
  const [betAmount, dispatch] = useReducer<React.Reducer<BetAmount, BetAmountAction>>(
    betAmountReducer,
    new BetAmount(initialEthPrice),
  );

  return {
    betAmount,
    updateUsd: (usd: number) => dispatch({ type: "SET_USD", payload: usd }),
    updateEth: (eth: number) => dispatch({ type: "SET_ETH", payload: eth }),
    updateWei: (wei: number) => dispatch({ type: "SET_WEI", payload: wei }),
    updateEthPrice: (ethPrice: number) => dispatch({ type: "SET_ETH_PRICE", payload: ethPrice }),
  };
};

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
  const ethPrice = 3800;
  const [loading, setLoading] = useState(false);
  const [hashPick, setHashPick] = useState<string | string[]>("0");
  const { betAmount, updateUsd, updateEth, updateWei, updateEthPrice } = useBetAmount(ethPrice);

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
            <BetAmountPicker betAmount={betAmount} updateUsd={updateUsd} updateEth={updateEth} updateWei={updateWei} />
            <div className="w-full mt-6">
              {/* Key-Value Lines */}
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Current ETH Price</span>
                <span className="text-sm text-gray-600">${ethPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Wager Value</span>
                <span className="text-sm text-gray-600">${betAmount.usd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Possible Winnings</span>
                <span className="text-sm text-gray-600">${(betAmount.usd * 16).toFixed(2)}</span>
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
                      value: BigInt(betAmount.wei),
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
