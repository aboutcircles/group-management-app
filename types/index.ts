import { Address } from 'viem';
import { CirclesEvent, type GroupRow } from '@circles-sdk/data';
import type { Profile } from '@circles-sdk/profiles';

export type Group = GroupRow & Profile;

export type ProfileWithAddress = Profile & {
  address: Address;
  relation?: string;
  symbol?: string;
};

// export type FullProfile = Profile & Group & {
//   address: Address;
// };

export enum RelationType {
  TrustedBy = 'trustedBy',
  Trusts = 'trusts',
  MutuallyTrusts = 'mutuallyTrusts',
}

export const circlesEventTypes = [
  'CrcV2_Trust',
  'CrcV2_TransferSingle',
  'CrcV2_ApprovalForAll',
  'CrcV2_TransferBatch',
  'CrcV2_GroupMintSingle',
  'CrcV2_GroupMintBatch',
];

export type MintPolicy = {
  id: number;
  name: string;
};

export type FormattedEvent = CirclesEvent & {
  date: string;
  time: string;
  member?: Address;
  eventInfo?: any;
};

export type Step = 'start' | 'form' | 'executed' | 'error';
