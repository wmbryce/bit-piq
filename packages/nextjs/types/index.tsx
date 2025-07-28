export type BlockType = {
  baseFeePerGas: bigint | null;
  blobGasUsed: bigint | null;
  difficulty: bigint;
  excessBlobGas: bigint | null;
  extraData: string;
  gasLimit: bigint;
  gasUsed: bigint;
  hash: string | null;
  logsBloom: string | null;
  miner: string;
  mixHash: string;
  nonce: string | null;
  number: bigint | null;
  parentBeaconBlockRoot: string | null;
  parentHash: string | null;
  receiptsRoot: string | null;
  sha3Uncles: string | null;
  size: bigint | null;
  stateRoot: string | null;
  timestamp: bigint | null;
  totalDifficulty: bigint;
  transactions: any[]; // Could be further typed based on transaction structure
  transactionsRoot: string | null;
  uncles: string[];
  withdrawals: any[]; // Could be further typed based on withdrawal structure
  withdrawalsRoot: string | null;
};
