import { MintPolicy } from '@/types';
import { CirclesConfig } from '@circles-sdk/sdk';
import { Address } from 'viem';

// Gnosis:
export const chainConfigGnosis: CirclesConfig = {
  circlesRpcUrl: 'https://rpc.aboutcircles.com/',
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  v1HubAddress: '0x29b9a7fbb8995b2423a71cc17cf9810798f6c543',
  v2HubAddress: '0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8',
  nameRegistryAddress: '0xA27566fD89162cC3D40Cb59c87AAaA49B85F3474',
  migrationAddress: '0xD44B8dcFBaDfC78EA64c55B705BFc68199B56376',
  profileServiceUrl: 'https://rpc.aboutcircles.com/profiles/',
};

const baseGroupMintPolicy = '0xcCa27c26CF7BAC2a9928f42201d48220F0e3a549';

export const mintPolicies: MintPolicy[] = [
  {
    id: 0,
    address: baseGroupMintPolicy as Address,
    name: `Standard Mint Policy - ${baseGroupMintPolicy}`,
  },
];
