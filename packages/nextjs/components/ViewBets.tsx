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

  console.log({ bets });

  const headers = [
    {
      label: "Block",
      key: "block",
    },
    {
      label: "Pick",
      key: "pick",
    },
    {
      label: "Amount",
      key: "amount",
    },
    {
      label: "Time",
      key: "time",
    },
    {
      label: "Status",
      key: "status",
    },
  ];

  return (
    <div className="flex flex-col justify-start items-start rounded-md p-4">
      {bets?.length > 0 ? (
        <>
          <h1 className="text-lg font-medium text-slate-900 text-left mb-0">Active Wagers</h1>
          <h2 className="text-sm text-slate-600 text-left">These are your active wagers that you can redeem</h2>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto border-collapse mt-4">
              <thead>
                <tr className="bg-slate-100">
                  {headers.map(header => (
                    <th
                      key={header.key}
                      className="px-6 py-3 text-left text-sm font-medium text-slate-900 border-b border-slate-200"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {bets?.map((bet: any) => (
                  <tr key={bet.id} className="hover:bg-slate-50 transition-colors">
                    {headers.map(header => (
                      <td
                        key={header.key + bet.id}
                        className="px-6 py-4 text-sm text-slate-900 border-b border-slate-100"
                      >
                        {bet[header.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row justify-end items-center gap-4 mt-4 w-full">
            <button
              onClick={() =>
                writeClaimWinnings({
                  args: [connectedAddress],
                })
              }
              className="bg-black text-white px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
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
