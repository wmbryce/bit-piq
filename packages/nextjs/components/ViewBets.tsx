import React from "react";
import { useScaffoldReadContract } from "@/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "@/hooks/scaffold-eth";
import { useAccount } from "wagmi";

interface ViewBetsProps {
  toggleTab: () => void;
}

const ViewBets: React.FC<ViewBetsProps> = ({ toggleTab }) => {
  const { address: connectedAddress } = useAccount();

  const { writeContractAsync: writeClaimWinnings } = useScaffoldWriteContract("BitPiq");

  const { data: bets } = useScaffoldReadContract({
    contractName: "BitPiq",
    functionName: "getBets",
    args: [connectedAddress],
  });

  console.log(bets);

  return (
    <div className="flex flex-col justify-start items-start rounded-md p-4">
      {bets?.length > 0 ? (
        <>
          <h1 className="text-lg font-medium text-slate-900 text-left mb-0">Active Wagers</h1>
          <h2 className="text-sm text-slate-600 text-left">These are your active wagers that you can redeem</h2>
          <table className="flex flex-col justify-start items-center bg-gray-200 rounded-md p-4">
            <thead>
              <tr>
                <th>Block</th>
                <th>Pick</th>
                <th>Amount</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bets?.map((bet: any) => (
                <tr key={bet.id}>
                  <td>{bet.block}</td>
                  <td>{bet.pick}</td>
                  <td>{bet.amount}</td>
                  <td>{bet.time}</td>
                  <td>{bet.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-row justify-end items-center gap-4">
            <button
              onClick={() =>
                writeClaimWinnings({
                  args: [connectedAddress],
                })
              }
            >
              Redeem
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-start items-start rounded-md">
          <h1 className="text-lg font-medium text-slate-900 text-left mb-0">No active wagers</h1>
          <h2 className="text-sm text-slate-600 text-left">Place a bet to get started!</h2>
          <button className="bg-black text-white px-4 py-2 mt-2 rounded-md hover:opacity-50" onClick={toggleTab}>
            Place Bet
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewBets;
