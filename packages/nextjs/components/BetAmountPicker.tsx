import { useState } from "react";
import Image from "next/image";
import { NumericFormat } from "react-number-format";

const BetAmountPicker = () => {
  const [activeMode, setActiveMode] = useState<"USD" | "ETH" | "WEI">("USD");
  const [betAmount, setBetAmount] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleToggleMode = (mode: "USD" | "ETH" | "WEI") => {
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

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-bold text-left">Wager Amount</h1>
          <h2 className="text text-gray-600 text-left">Winnings are paid out 16 to 1</h2>
        </div>
        <div className="flex bg-gray-200 rounded-full overflow-hidden w-48">
          <button
            className={`flex-1 py-1 text-sm font-medium ${activeMode === "USD" ? "bg-white shadow" : "bg-transparent"}`}
            onClick={() => handleToggleMode("USD")}
          >
            USD
          </button>
          <button
            className={`flex-1 py-1 text-sm font-medium ${activeMode === "ETH" ? "bg-white shadow" : "bg-transparent"}`}
            onClick={() => handleToggleMode("ETH")}
          >
            ETH
          </button>
          <button
            className={`flex-1 py-1 text-sm font-medium ${activeMode === "WEI" ? "bg-white shadow" : "bg-transparent"}`}
            onClick={() => handleToggleMode("WEI")}
          >
            WEI
          </button>
        </div>
      </div>
      <div className="relative w-full">
        <div className="relative flex items-center bg-gray-200 rounded-md pl-7">
          <Image
            src="/assets/icons/ethereum-eth-logo.svg"
            alt="ETH"
            width={18}
            height={18}
            className={`${activeMode === "USD" ? "invisible" : ""} absolute left-2`}
          />
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
            className="w-full h-16 bg-transparent text-3xl font-bold text-left rounded-md outline-none pr-20"
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
