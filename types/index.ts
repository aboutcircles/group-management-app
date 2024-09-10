import { Address } from 'viem';
import { type GroupRow } from '@circles-sdk/data';
import type { Profile } from '@circles-sdk/profiles';

export type Group = GroupRow & Profile;

export type ProfileWithAddress = Profile & {
  address: Address;
  relation?: string;
};

export enum RelationType {
  TrustedBy = 'trustedBy',
  Trusts = 'trusts',
  MutuallyTrusts = 'mutuallyTrusts',
}

export enum CirclesEventType {
  // CrcV1_Trust = 'CrcV1_Trust',
  // CrcV1_Transfer = 'CrcV1_Transfer',
  // CrcV2_PersonalMint = 'CrcV2_PersonalMint',
  // CrcV2_Stopped = 'CrcV2_Stopped',
  CrcV2_Trust = 'CrcV2_Trust',
  CrcV2_TransferSingle = 'CrcV2_TransferSingle',
  // CrcV2_URI = 'CrcV2_URI',
  CrcV2_ApprovalForAll = 'CrcV2_ApprovalForAll',
  CrcV2_TransferBatch = 'CrcV2_TransferBatch',
  // CrcV2_RegisterShortName = 'CrcV2_RegisterShortName',
  // CrcV2_UpdateMetadataDigest = 'CrcV2_UpdateMetadataDigest',
  // CrcV2_CidV0 = 'CrcV2_CidV0',
  // CrcV2_StreamCompleted = 'CrcV2_StreamCompleted',
  CrcV2_GroupMintSingle = 'CrcV2_GroupMintSingle',
  CrcV2_GroupMintBatch = 'CrcV2_GroupMintBatch',
  // CrcV2_GroupRedeem = 'CrcV2_GroupRedeem',
  // CrcV2_GroupRedeemCollateralReturn = 'CrcV2_GroupRedeemCollateralReturn',
  // CrcV2_GroupRedeemCollateralBurn = 'CrcV2_GroupRedeemCollateralBurn',
}

export const circlesEventTypes = [
  'CrcV2_Trust',
  'CrcV2_TransferSingle',
  'CrcV2_ApprovalForAll',
  'CrcV2_TransferBatch',
  'CrcV2_GroupMintSingle',
  'CrcV2_GroupMintBatch',
];
