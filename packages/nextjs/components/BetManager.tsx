import { useEffect, useReducer, useState } from "react";
import PlaceBet from "./PlaceBet";
import ViewBets from "./ViewBets";
import { useGlobalState } from "@/services/store/store";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

// import { motion } from "framer-motion";

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

const useBetAmount = (ethPrice: number) => {
  const [betAmount, dispatch] = useReducer<React.Reducer<BetAmount, BetAmountAction>>(
    betAmountReducer,
    new BetAmount(ethPrice),
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

const BetManager = ({ writePlaceBet }: { writePlaceBet: any }) => {
  const [activeTab, setActiveTab] = useState<BetManagerTabEnum>(BetManagerTabEnum.PLACE_BET);
  const [loading, setLoading] = useState(false);
  const [hashPick, setHashPick] = useState<string | string[]>("0");

  const ethPrice = useGlobalState(state => state?.nativeCurrency?.price);

  const { betAmount, updateUsd, updateEth, updateWei, updateEthPrice } = useBetAmount(ethPrice);

  useEffect(() => {
    updateEthPrice(ethPrice);
  }, [ethPrice]);

  const handleTabChange = (newTab: BetManagerTabEnum) => {
    setActiveTab(newTab);
  };

  const tabs = [
    {
      label: "Place Bet",
      value: BetManagerTabEnum.PLACE_BET,
      length: 100,
    },
    {
      label: "View Bets",
      value: BetManagerTabEnum.VIEW_BETS,
      length: 100,
    },
  ];

  return (
    <div className="border-[1px] border-slate-200 rounded-md shadow-md bg-slate-50 z-40 w-[480px] h-fit mt-8">
      <div className="border-b-[1px] border-gray-200 flex items-center pt-4 px-4 gap-8 relative">
        {tabs.map(tab => (
          <button
            key={tab.value}
            className={cn(
              "text-sm py-0.5 font-sans px-1 text-slate-500",
              activeTab === tab.value && "active text-slate-800 font-medium",
            )}
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
        <motion.div
          className="h-0.5 bottom-0  bg-gray-700 absolute"
          style={{ width: `76px`, left: "16px" }}
          animate={{ x: activeTab === BetManagerTabEnum.PLACE_BET ? 0 : 102 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      </div>
      <div className="p-4">
        {activeTab === BetManagerTabEnum.PLACE_BET && (
          <PlaceBet
            setHashPick={setHashPick}
            betAmount={betAmount}
            updateUsd={updateUsd}
            updateEth={updateEth}
            updateWei={updateWei}
            ethPrice={ethPrice}
            setLoading={setLoading}
            writePlaceBet={writePlaceBet}
            loading={loading}
            hashPick={hashPick}
          />
        )}
        {activeTab === BetManagerTabEnum.VIEW_BETS && (
          <ViewBets toggleTab={() => handleTabChange(BetManagerTabEnum.PLACE_BET)} />
        )}
      </div>
    </div>
  );
};

export default BetManager;
