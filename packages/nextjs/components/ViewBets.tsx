import React, { useMemo, useState } from "react";
import { useScaffoldReadContract } from "@/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "@/hooks/scaffold-eth";
import { numberToHex } from "viem";
import { useAccount } from "wagmi";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface ViewBetsProps {
  toggleTab: () => void;
}

interface BetType {
  betId: bigint;
  blockNumber: bigint;
  hashPick: string;
  ethAmount: bigint;
  claimed: boolean;
}

type HeaderConfig<T> = {
  label: string;
  key: keyof T;
  format?: (value: T[keyof T]) => string;
};

const headers: HeaderConfig<BetType>[] = [
  {
    label: "Block",
    key: "blockNumber",
    format: value => value.toString(),
  },
  {
    label: "Pick",
    key: "hashPick",
    format: value => {
      const pick = numberToHex(value as bigint);
      return pick;
    },
  },
  {
    label: "Claimed",
    key: "claimed",
    format: value => {
      const claimed = value ? "Yes" : "No";
      console.log("claimed: ", claimed);
      return claimed;
    },
  },
  {
    label: "Amount",
    key: "ethAmount",
    format: value => {
      const wei = BigInt(value);
      const gwei = Number(wei) / 1e9;
      const eth = Number(wei) / 1e18;
      const ethString = `${eth} ETH`;
      const gweiString = `${gwei} gwei`;
      const weiString = `${wei.toString()} wei`;
      return ethString.length < gweiString.length
        ? ethString
        : gweiString.length < weiString.length
          ? gweiString
          : weiString;
    },
  },
];

const ViewBets: React.FC<ViewBetsProps> = ({ toggleTab }) => {
  const { address: connectedAddress } = useAccount();

  const { writeContractAsync: writeClaimWinnings } = useScaffoldWriteContract("BitPiq");

  const { data: bets } = useScaffoldReadContract({
    contractName: "BitPiq",
    functionName: "getBets",
    args: [connectedAddress],
  });

  console.log({ bets });

  const formattedBets = useMemo(() => {
    return bets
      ?.sort((a: BetType, b: BetType) => Number(b.betId) - Number(a.betId))
      .map((bet: BetType) => ({
        ...bet,
        betId: bet.betId as bigint,
      }));
  }, [bets]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const paginatedBets = useMemo(() => {
    if (!formattedBets) return [];
    const startIndex = currentPage * itemsPerPage;
    return formattedBets.slice(startIndex, startIndex + itemsPerPage);
  }, [formattedBets, currentPage]);

  const totalPages = useMemo(() => {
    return formattedBets ? Math.ceil(formattedBets.length / itemsPerPage) : 0;
  }, [formattedBets]);

  return (
    <div className="flex flex-col justify-start items-start rounded-md p-4">
      {bets?.length > 0 ? (
        <>
          <h1 className="text-lg font-medium text-slate-900 text-left mb-0">Active Wagers</h1>
          <h2 className="text-sm text-slate-600 text-left">These are your active wagers that you can redeem</h2>
          <div className="w-full overflow-x-auto bg-slate-100 mt-4 rounded-md">
            <table className="min-w-full table-auto border-collapse ">
              <thead>
                <tr className="rounded-t-md">
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
                {paginatedBets?.map((bet: BetType) => (
                  <tr key={bet.betId} className="transition-colors">
                    {headers.map(header => (
                      <td
                        key={header.key + bet.betId}
                        className="px-6 py-4 text-sm font-medium text-slate-900 border-b border-slate-100 whitespace-nowrap"
                      >
                        {header.format && bet?.[header.key] ? header.format(bet?.[header.key]) : bet?.[header.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center gap-2 w-full mt-4 rounded-b-md bg-slate-100">
              <span className="text-sm text-slate-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 rounded-md bg-slate-200 disabled:opacity-50"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 rounded-md bg-slate-200 disabled:opacity-50"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-row justify-end items-center gap-4 mt-4 w-full">
            <button
              onClick={() => {
                const formattedBetIds = bets
                  .filter((bet: BetType) => !bet.claimed)
                  .map((bet: BetType) => bet.betId as bigint);
                console.log("formatted bet ids: ", formattedBetIds);
                writeClaimWinnings({
                  functionName: "claimWinnings",
                  args: [connectedAddress, formattedBetIds],
                });
              }}
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
