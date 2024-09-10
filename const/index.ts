import { MintPolicy } from '@/types';
import { CirclesConfig } from '@circles-sdk/sdk';

export const mintPolicies: MintPolicy[] = [
  { id: 1, name: '0x5Ea08c967C69255d82a4d26e36823a720E7D0317' },
];

export const CIRCLES_RPC = 'https://rpc.helsinki.aboutcircles.com';

// Gnosis:
export const chainConfigGnosis: CirclesConfig = {
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  circlesRpcUrl: 'https://rpc.helsinki.aboutcircles.com',
  v1HubAddress: '0x29b9a7fbb8995b2423a71cc17cf9810798f6c543',
  v2HubAddress: '0xa5c7ADAE2fd3844f12D52266Cb7926f8649869Da',
  migrationAddress: '0xe1dCE89512bE1AeDf94faAb7115A1Ba6AEff4201',
  nameRegistryAddress: '0x738fFee24770d0DE1f912adf2B48b0194780E9AD',
  profileServiceUrl: 'https://chiado-pathfinder.aboutcircles.com/profiles/',
};
