'use client';

import { CirclesConfig } from '@circles-sdk/sdk';

// Gnosis:
export const chainConfigGnosis: CirclesConfig = {
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  circlesRpcUrl: 'https://rpc.helsinki.aboutcircles.com',
  v1HubAddress: '0x29b9a7fbb8995b2423a71cc17cf9810798f6c543',
  v2HubAddress: '',
  migrationAddress: '',
};

// Chiado testnet:
export const chainConfigChiado: CirclesConfig = {
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  circlesRpcUrl: 'https://chiado-rpc.aboutcircles.com',
  v1HubAddress: '0xdbf22d4e8962db3b2f1d9ff55be728a887e47710',
  v2HubAddress: '0x2066CDA98F98397185483aaB26A89445addD6740',
  migrationAddress: '0x2A545B54bb456A0189EbC53ed7090BfFc4a6Af94',
};
