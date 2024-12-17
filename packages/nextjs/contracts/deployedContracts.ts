/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    BitPiq: {
      address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "betId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint8",
              name: "hashPick",
              type: "uint8",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "ethAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "blockNumber",
              type: "uint256",
            },
          ],
          name: "BetPlaced",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "Bets",
          outputs: [
            {
              internalType: "uint8",
              name: "hashPick",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "blockNumber",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "ethAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "betId",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "claimed",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "NextBetId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_address",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "_betIds",
              type: "uint256[]",
            },
          ],
          name: "claimWinnings",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_address",
              type: "address",
            },
          ],
          name: "getBets",
          outputs: [
            {
              components: [
                {
                  internalType: "uint8",
                  name: "hashPick",
                  type: "uint8",
                },
                {
                  internalType: "uint256",
                  name: "blockNumber",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "ethAmount",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "betId",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "claimed",
                  type: "bool",
                },
              ],
              internalType: "struct BitPiq.Bet[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint8",
              name: "_hashPick",
              type: "uint8",
            },
          ],
          name: "placeBet",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "support",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "winningsReserve",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
