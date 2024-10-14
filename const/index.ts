import { MintPolicy } from '@/types';
import { CirclesConfig } from '@circles-sdk/sdk';
import { Address } from 'viem';

export const CIRCLES_RPC = 'https://rpc.helsinki.aboutcircles.com';
// export const CIRCLES_RPC = 'https://rpc.falkenstein.aboutcircles.com';

// Gnosis:
export const chainConfigGnosis: CirclesConfig = {
  circlesRpcUrl: 'https://static.174.163.76.144.clients.your-server.de/rpc/',
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  v2PathfinderUrl:
    'https://static.174.163.76.144.clients.your-server.de/pathfinder/',
  v1HubAddress: '0x29b9a7fbb8995b2423a71cc17cf9810798f6c543',
  v2HubAddress: '0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8',
  nameRegistryAddress: '0xA27566fD89162cC3D40Cb59c87AAaA49B85F3474',
  migrationAddress: '0xD44B8dcFBaDfC78EA64c55B705BFc68199B56376',
  profileServiceUrl:
    'https://static.174.163.76.144.clients.your-server.de/profiles/',
  baseGroupMintPolicy: '0xcCa27c26CF7BAC2a9928f42201d48220F0e3a549',
};

export const mintPolicies: MintPolicy[] = [
  {
    id: 1,
    address: chainConfigGnosis.baseGroupMintPolicy as Address,
    name: `Standard Mint Policy - ${chainConfigGnosis.baseGroupMintPolicy}`,
  },
];
