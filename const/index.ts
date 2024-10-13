import { MintPolicy } from '@/types';
import { CirclesConfig } from '@circles-sdk/sdk';
import { Address } from 'viem';

export const CIRCLES_RPC = 'https://rpc.helsinki.aboutcircles.com';
// export const CIRCLES_RPC = 'https://rpc.falkenstein.aboutcircles.com';

// Gnosis:
export const chainConfigGnosis: CirclesConfig = {
  circlesRpcUrl: 'https://rpc.helsinki.aboutcircles.com/',
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  v2PathfinderUrl:
    'https://static.174.163.76.144.clients.your-server.de/pathfinder/',
  v1HubAddress: '0x29b9a7fbb8995b2423a71cc17cf9810798f6c543',
  v2HubAddress: '0x3a0F7848071f067c25b0747eC5bEdc77cb3778eb',
  nameRegistryAddress: '0x6192069E85afBD09D03f7e85eB6c35982A847e16',
  migrationAddress: '0x3483cE5904413bc4Fb83DA2E43540eD769752C88',
  profileServiceUrl: 'https://chiado-pathfinder.aboutcircles.com/profiles/',
  baseGroupMintPolicy: '0x48F6B0aa3Ca905C9DbE41717c7664639107257da',
};

export const mintPolicies: MintPolicy[] = [
  {
    id: 1,
    address: chainConfigGnosis.baseGroupMintPolicy as Address,
    name: `Standard Mint Policy - ${chainConfigGnosis.baseGroupMintPolicy}`,
  },
];
