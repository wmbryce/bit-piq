import { useState } from "react";

const BetAmountPicker = () => {
  const [activeMode, setActiveMode] = useState<"USD" | "ETH" | "WEI">("USD");
  const [betAmountInUSD, setBetAmountInUSD] = useState<number>(0);

  const handleToggleMode = (mode: "USD" | "ETH" | "WEI") => {
    setActiveMode(mode);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Heading Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-bold text-left">Wager Amount</h1>
          <h2 className="text text-gray-600 text-left">Winnings are paid out 16 to 1</h2>
        </div>
        <div className="flex items-center bg-gray-200 rounded-md p-1">
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeMode === "USD" ? "bg-white shadow" : "bg-transparent"
            }`}
            onClick={() => handleToggleMode("USD")}
          >
            USD
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeMode === "ETH" ? "bg-white shadow" : "bg-transparent"
            }`}
            onClick={() => handleToggleMode("ETH")}
          >
            ETH
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeMode === "WEI" ? "bg-white shadow" : "bg-transparent"
            }`}
            onClick={() => handleToggleMode("WEI")}
          >
            WEI
          </button>
        </div>
      </div>

      {/* Input Section */}
      {/* Full-Width Input Section */}
      <div className="w-full flex flex-col items-center">
        <input
          type="text"
          value={activeMode === "USD" ? `$${betAmountInUSD.toFixed(2)}` : betAmountInUSD}
          onChange={e => {
            if (activeMode === "USD") {
              const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
              setBetAmountInUSD(isNaN(value) ? 0 : value);
            } else {
              const value = parseFloat(e.target.value);
              setBetAmountInUSD(isNaN(value) ? 0 : value);
            }
          }}
          className="w-full h-16 bg-gray-300 text-3xl text-left rounded-md outline-none pl-4"
        />
      </div>
    </div>
  );
};

export default BetAmountPicker;
