import { Address } from 'viem';

export type Group = {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  balance?: string;
  members?: number;
  mint?: Address;
};

export type TrustRelation = {
  blockNumber: number;
  expiryTime: number;
  limit?: number;
  logIndex: number;
  timestamp: number;
  transactionHash: string;
  transactionIndex: number;
  trustee: Address;
  truster: Address;
  version: number;
};
