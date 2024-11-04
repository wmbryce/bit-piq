"use client";

import { useState } from "react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  //   const { address: connectedAddress } = useAccount();
  const [hashPick, setHashPick] = useState<boolean[]>([false, false, false, false]);

  const handleToggleHashPick = (index: number) => {
    setHashPick(prev => {
      const newHashPick = [...prev];
      newHashPick[index] = !newHashPick[index];
      return newHashPick;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h1 className="text-4xl font-bold">BIT PIQ</h1>
      <p>
        Welcome to the hash betting game. Every 10 minutes a new block is mined. Bit piq, allows you to bet on the last
        four bits of that block hash.
      </p>
      <div className="flex flex-row">
        {hashPick.map((pick, index) => (
          <button
            key={index}
            className="w-36 h-60 bg-gray-200 mx-2 rounded-md text-6xl font-bold"
            onClick={() => handleToggleHashPick(index)}
          >
            {pick ? "1" : "0"}
          </button>
        ))}
      </div>
      <button className="bg-black text-white px-4 py-2 mt-4 rounded-md">Bet</button>
    </div>
  );
};

export default Home;
