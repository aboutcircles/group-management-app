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
