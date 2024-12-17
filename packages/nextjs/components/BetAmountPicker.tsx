import { useState } from "react";
import { BetAmount } from "./BetManager";
import { motion } from "framer-motion";
import { NumericFormat } from "react-number-format";

enum BetAmountMode {
  USD = "USD",
  ETH = "ETH",
  WEI = "WEI",
}

type BetAmountPickerProps = {
  betAmount: BetAmount;
  updateUsd: (usd: number) => void;
  updateEth: (eth: number) => void;
  updateWei: (wei: number) => void;
};

const BetAmountPicker = ({ betAmount, updateUsd, updateEth, updateWei }: BetAmountPickerProps) => {
  const [activeMode, setActiveMode] = useState<BetAmountMode>(BetAmountMode.USD);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseDown = (changeFn: () => void) => {
    changeFn();
    const timeout = setTimeout(() => {
      const interval = setInterval(changeFn, 100);
      setIntervalId(interval);
    }, 300);
    setTimeoutId(timeout);
  };

  const handleMouseUp = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);
    setTimeoutId(null);
    setIntervalId(null);
  };

  const getIncrementValue = () => {
    switch (activeMode) {
      case BetAmountMode.USD:
        return 1; // Increment by $1
      case BetAmountMode.ETH:
        return 0.0001; // Increment by 0.0001 ETH
      case BetAmountMode.WEI:
        return 1e12; // Increment by 1 trillion WEI (1 szabo)
      default:
        return 0;
    }
  };

  const handleIncrement = () => {
    const incrementValue = getIncrementValue();
    handleValueChange(String(getDisplayValue() + incrementValue));
  };

  const handleDecrement = () => {
    const decrementValue = getIncrementValue();
    handleValueChange(String(Math.max(0, getDisplayValue() - decrementValue))); // Ensure value doesn't go below 0
  };

  const modes: BetAmountMode[] = [BetAmountMode.USD, BetAmountMode.ETH, BetAmountMode.WEI];

  const handleValueChange = (value: string) => {
    const numericValue = Math.max(0, parseFloat(value || "0"));
    switch (activeMode) {
      case BetAmountMode.USD:
        updateUsd(numericValue);
        break;
      case BetAmountMode.ETH:
        updateEth(numericValue);
        break;
      case BetAmountMode.WEI:
        updateWei(numericValue);
        break;
    }
  };

  const getDisplayValue = () => {
    switch (activeMode) {
      case BetAmountMode.USD:
        return betAmount.usd;
      case BetAmountMode.ETH:
        return betAmount.eth;
      case BetAmountMode.WEI:
        return betAmount.wei;
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-lg font-medium text-left mb-0">Wager Amount</h1>
          <h2 className="text-sm text-gray-600 text-left">Winnings are paid out 16 to 1</h2>
        </div>
        <motion.div className="flex items-center bg-gray-200 rounded-md p-1 relative" layout>
          <motion.div
            layoutId="active-container"
            className="bg-white shadow rounded-md p-1 z-0 absolute h-[36px] w-[31%] m-1"
            style={{
              left: 0,
            }}
            animate={{
              x: activeMode === BetAmountMode.USD ? "0px" : activeMode === BetAmountMode.ETH ? "108%" : "208%",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
          {modes.map(mode => (
            <motion.button
              key={mode}
              className={"z-10 flex-1 px-4 py-2 text-sm rounded-md font-medium bg-transparent"}
              onClick={() => setActiveMode(mode)}
            >
              {mode}
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div className="relative w-full">
        <div className="relative flex items-center bg-gray-200 rounded-md pl-4">
          <NumericFormat
            value={getDisplayValue()}
            onValueChange={({ value }) => handleValueChange(value)}
            thousandSeparator={activeMode === BetAmountMode.USD}
            prefix={activeMode === BetAmountMode.USD ? "$" : ""}
            suffix={activeMode === BetAmountMode.ETH || activeMode === BetAmountMode.USD ? "" : " wei"}
            allowNegative={false}
            decimalScale={activeMode === BetAmountMode.WEI ? 0 : 8}
            fixedDecimalScale={false}
            placeholder={activeMode === BetAmountMode.USD ? "$0" : "0"}
            className="w-full h-14 bg-transparent text-xl font-medium text-left rounded-md outline-none pr-0"
          />
        </div>

        <div className="absolute inset-y-0 right-0 flex flex-row items-center">
          <button
            className="w-10 h-10 bg-gray-300 hover:bg-gray-200 border-gray-400 flex justify-center items-center text-lg font-bold rounded"
            style={{
              padding: "6px",
              marginRight: "6px",
              boxShadow: "inset 0 0 3px rgba(0, 0, 0, 0.1)",
            }}
            onMouseDown={() => handleMouseDown(handleDecrement)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            -
          </button>
          <button
            className="w-10 h-10 bg-gray-300 hover:bg-gray-200 border-gray-400 flex justify-center items-center text-lg font-bold rounded"
            style={{
              padding: "6px",
              marginRight: "8px",
              boxShadow: "inset 0 0 3px rgba(0, 0, 0, 0.1)",
            }}
            onMouseDown={() => handleMouseDown(handleIncrement)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetAmountPicker;
