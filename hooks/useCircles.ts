'use client';
import { useEffect, useState } from 'react';
import { CirclesConfig, Sdk } from '@circles-sdk/sdk';
import type { GroupProfile } from '@circles-sdk/profiles';
import { ethers } from 'ethers';
// import { useSafe } from '@/hooks/useSafe';

// Gnosis:
export const chainConfigGnosis: CirclesConfig = {
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  circlesRpcUrl: 'https://rpc.helsinki.aboutcircles.com',
  v1HubAddress: '0x29b9a7fbb8995b2423a71cc17cf9810798f6c543',
  v2HubAddress: '0x7bC1F123089Bc1f384b6379d0587968d1CD5830a',
  migrationAddress: '0xEaBa6046103C3A2f5A681fD4323f78C647Fb4292',
  nameRegistryAddress: '0xb95ef3f3e693531d9588815bca954dc8dce30937',
  profileServiceUrl: 'https://chiado-pathfinder.aboutcircles.com/profiles/',
};

// Chiado testnet:
export const chainConfigChiado: CirclesConfig = {
  pathfinderUrl: 'https://chiado-pathfinder.aboutcircles.com',
  circlesRpcUrl: 'https://chiado-rpc.aboutcircles.com',
  v1HubAddress: '0xdbf22d4e8962db3b2f1d9ff55be728a887e47710',
  v2HubAddress: '0x2066CDA98F98397185483aaB26A89445addD6740',
  migrationAddress: '0x2A545B54bb456A0189EbC53ed7090BfFc4a6Af94',
  nameRegistryAddress: '0x64703664BBc8A3BaeD014171e86Dfc2dF2E07A08',
  profileServiceUrl: 'https://chiado-pathfinder.aboutcircles.com/profiles/',
};

export default function useCircles() {
  const [circles, setCircles] = useState<Sdk | null>(null);
  const [eoaAddress, setEoaAddress] = useState<string | null>(null);

  // const { safeOwners } = useSafe();

  useEffect(() => {
    async function initializeSdk() {
      const windowEthereum = (window as any).ethereum;
      if (!windowEthereum) {
        console.error('window.ethereum is not installed');
        return;
      }

      try {
        const accounts = await windowEthereum.request({
          method: 'eth_requestAccounts',
        });
        const currentAccount = accounts[0]; // Get the first account

        console.log('currentAccount', currentAccount);

        const browserProvider = new ethers.BrowserProvider(windowEthereum);
        const addr = await browserProvider.send('eth_requestAccounts', []);
        console.log('addr', addr);
        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();

        // if (safeOwners && safeOwners.includes(address)) {
        //   console.log('safe owner');
        // } else {
        //   console.log('eoa not safe owner');
        // }

        const newSdk = new Sdk(chainConfigGnosis, {
          runner: signer,
          address,
        });
        setCircles(newSdk);
        console.log('address eoa', address);
        setEoaAddress(address);
      } catch (error) {
        console.error('Failed to initialize SDK:', error);
      }
    }

    initializeSdk();
  }, []);

  const findGroupByAddress = async (address: string) => {
    try {
      const getGroups = circles?.data.findGroups(10, {
        groupAddressIn: [address],
      });

      if (await getGroups?.queryNextPage()) {
        const groupsResult = getGroups?.currentPage?.results ?? [];
        return groupsResult.reduce((acc, group) => {
          acc[group.group] = group;
          return acc;
        }, {} as Record<string, any>);
      }
    } catch (error) {
      console.error('Failed to find group by address:', error);
      return [];
    }
  };

  const getTrustRelations = async (address: string) => {
    try {
      const trustRelations = circles?.data.getTrustRelations(address, 10);
      if (await trustRelations?.queryNextPage()) {
        const trustRelationsResult = trustRelations?.currentPage?.results ?? [];
        return trustRelationsResult;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Failed to get trust relations:', error);
      return [];
    }
  };

  const registerGroup = async (mintPolicy: string, groupData: GroupProfile) => {
    const profile: GroupProfile = {
      name: groupData.name,
      description: groupData.description,
      previewImageUrl: groupData.previewImageUrl,
      imageUrl: groupData.imageUrl,
      symbol: groupData.symbol,
    };

    try {
      console.log('creating group...');
      const newGroup = await circles?.registerGroupV2(mintPolicy, profile);
      console.log('newGroup', newGroup);
      return newGroup;
    } catch (error) {
      console.error('Failed to register group:', error);
    }
  };

  return {
    circles,
    eoaAddress,
    findGroupByAddress,
    getTrustRelations,
    registerGroup,
  };
}
