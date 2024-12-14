import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { NumericFormat } from "react-number-format";

enum BetAmountMode {
  USD = "USD",
  ETH = "ETH",
  WEI = "WEI",
}

const BetAmountPicker = () => {
  const [activeMode, setActiveMode] = useState<BetAmountMode>(BetAmountMode.USD);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleToggleMode = (mode: BetAmountMode) => {
    setActiveMode(mode);
  };

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

  const modes: BetAmountMode[] = [BetAmountMode.USD, BetAmountMode.ETH, BetAmountMode.WEI];

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-lg font-medium text-left mb-0">Wager Amount</h1>
          <h2 className="text-sm text-gray-600 text-left">Winnings are paid out 16 to 1</h2>
        </div>
        <motion.div className="flex items-center bg-gray-200 rounded-md p-1" layout>
          {modes.map(mode => (
            <motion.button
              // layoutId={activeMode === mode ? "focused" : "unfocused"}
              key={mode}
              className={`flex-1 px-4 py-2 text-sm rounded-md font-medium ${activeMode === mode ? "bg-white shadow" : "bg-transparent"}`}
              onClick={() => handleToggleMode(mode)}
            >
              {mode}
            </motion.button>
          ))}
        </motion.div>
      </div>
      <div className="relative w-full">
        <div className="relative flex items-center bg-gray-200 rounded-md pl-4">
          {/* <Image
            src="/assets/icons/ethereum-eth-logo.svg"
            alt="ETH"
            width={18}
            height={18}
            className={`${activeMode === "USD" ? "invisible" : ""} absolute left-2`}
          /> */}
          <NumericFormat
            value={betAmount === 0 ? "" : betAmount}
            onValueChange={({ value }) => {
              setBetAmount(parseFloat(value) || 0);
            }}
            thousandSeparator={activeMode === "USD"}
            prefix={activeMode === "USD" ? "$" : ""}
            allowNegative={false}
            decimalScale={activeMode === "WEI" ? 0 : 8}
            fixedDecimalScale={false}
            placeholder={activeMode === "USD" ? "$0" : "0"}
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
            onMouseDown={() =>
              handleMouseDown(() => setBetAmount(prev => Math.max(0, activeMode === "WEI" ? prev - 1 : prev - 0.01)))
            }
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
            onMouseDown={() =>
              handleMouseDown(() => setBetAmount(prev => (activeMode === "WEI" ? prev + 1 : prev + 0.01)))
            }
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
