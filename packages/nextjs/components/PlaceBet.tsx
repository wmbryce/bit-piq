import React, { Dispatch, SetStateAction } from "react";
import BetAmountPicker from "./BetAmountPicker";
import HashPicker from "./HashPicker";

// Assuming this is where the function is defined

interface PlaceBetProps {
  setHashPick: Dispatch<SetStateAction<string | string[]>>;
  betAmount: {
    usd: number;
    eth: number;
    wei: number;
    ethPrice: number;
    setEthPrice: (ethPrice: number) => void;
    setUsd: (usd: number) => void;
    setEth: (eth: number) => void;
    setWei: (wei: number) => void;
  };
  updateUsd: (usd: number) => void;
  updateEth: (eth: number) => void;
  updateWei: (wei: number) => void;
  ethPrice: number;
  setLoading: (loading: boolean) => void;
  writePlaceBet: any;
  loading: boolean;
  hashPick: string | string[];
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

const PlaceBet = ({
  setHashPick,
  betAmount,
  updateUsd,
  updateEth,
  updateWei,
  ethPrice,
  setLoading,
  writePlaceBet,
  loading,
  hashPick,
}: PlaceBetProps) => {
  return (
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
  );
};

export default PlaceBet;
