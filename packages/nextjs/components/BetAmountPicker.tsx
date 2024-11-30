import { useEffect, useState } from "react";

const BetAmountPicker = ({
  setBetAmountInWei,
}: {
  setBetAmountInWei: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [betAmountInUSD, setBetAmountInUSD] = useState<number>(0);
  const [betAmountInEth, setBetAmountInEth] = useState<number>(0);
  const [displayMode, setDisplayMode] = useState<"ETH" | "WEI">("ETH");

  const ethPrice = 2000; // Hardcoded ETH price in USD

  // Sync ETH and USD when USD input changes
  useEffect(() => {
    const ethValue = betAmountInUSD / ethPrice;
    if (!isNaN(ethValue)) {
      setBetAmountInEth(ethValue);
      setBetAmountInWei(Math.round(ethValue * 1e18));
    }
  }, [betAmountInUSD, setBetAmountInWei]);

  // Sync USD when ETH/WEI input changes
  useEffect(() => {
    const usdValue = betAmountInEth * ethPrice;
    setBetAmountInUSD(usdValue);
    setBetAmountInWei(Math.round(betAmountInEth * 1e18));
  }, [betAmountInEth, setBetAmountInWei]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-500 mb-2">{`ETH Price: $${ethPrice} per ETH`}</p>

      <div className="flex flex-row items-center justify-center space-x-6">
        {/* USD Input */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">USD</h2>
          <div className="flex items-center justify-center w-36 h-20 bg-gray-300 rounded-md">
            <div
              className="w-full h-full flex items-center justify-center text-4xl font-bold overflow-hidden text-ellipsis"
              style={{
                fontSize: "2.5rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <input
                type="number"
                value={betAmountInUSD}
                step="0.01"
                onChange={e => setBetAmountInUSD(parseFloat(e.target.value) || 0)}
                className="w-full h-full bg-transparent text-center outline-none"
              />
            </div>
          </div>
        </div>

        {/* ETH/WEI Input */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">{displayMode}</h2>
          <div className="flex items-center justify-center w-36 h-20 bg-gray-300 rounded-md">
            <div
              className="w-full h-full flex items-center justify-center text-4xl font-bold overflow-hidden text-ellipsis"
              style={{
                fontSize: "2.5rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <input
                type="number"
                value={displayMode === "ETH" ? betAmountInEth : Math.round(betAmountInEth * 1e18)}
                onChange={e => {
                  const value = parseFloat(e.target.value) || 0;
                  if (displayMode === "ETH") {
                    setBetAmountInEth(value);
                  } else {
                    setBetAmountInWei(Math.round(value));
                  }
                }}
                className="w-full h-full bg-transparent text-center outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => setDisplayMode(displayMode === "ETH" ? "WEI" : "ETH")}
            className="mt-2 bg-black text-white px-2 py-1 rounded-md text-sm"
          >
            Switch to {displayMode === "ETH" ? "WEI" : "ETH"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetAmountPicker;
