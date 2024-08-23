import { useEffect, useState } from 'react';
import { Avatar, CirclesConfig, Sdk } from '@circles-sdk/sdk';
import { ethers } from 'ethers';
import type { GroupProfile } from '@circles-sdk/profiles';

// Gnosis Config
export const chainConfigGnosis: CirclesConfig = {
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  circlesRpcUrl: 'https://rpc.helsinki.aboutcircles.com',
  v1HubAddress: '0x29b9a7fbb8995b2423a71cc17cf9810798f6c543',
  v2HubAddress: '0x7bC1F123089Bc1f384b6379d0587968d1CD5830a',
  profileServiceUrl: 'https://chiado-pathfinder.aboutcircles.com/profiles/',
};

// Chiado Testnet Config
export const chainConfigChiado: CirclesConfig = {
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  circlesRpcUrl: 'https://chiado-rpc.aboutcircles.com',
  v1HubAddress: '0xdbf22d4e8962db3b2f1d9ff55be728a887e47710',
  v2HubAddress: '0x2066CDA98F98397185483aaB26A89445addD6740',
  migrationAddress: '0x2A545B54bb456A0189EbC53ed7090BfFc4a6Af94',
};

export default function useCircles(formData: {
  name: string;
  description: string;
  symbol: string;
}) {
  const [circles, setCircles] = useState<Sdk | null>(null);
  const [eoaAddress, setEoaAddress] = useState<string | null>(null);

  useEffect(() => {
    async function initializeSdk() {
      const windowEthereum = (window as any).ethereum;
      if (!windowEthereum) {
        console.error('window.ethereum is not installed');
        return;
      }

      try {
        const browserProvider = new ethers.BrowserProvider(windowEthereum);
        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();
        const newSdk = new Sdk(chainConfigGnosis, {
          runner: signer,
          address,
        });
        setCircles(newSdk);
        setEoaAddress(address);
      } catch (error) {
        console.error('Failed to initialize SDK:', error);
      }
    }

    initializeSdk();
  }, []);

  const profile: GroupProfile = {
    name: formData.name,
    description: formData.description,
    previewImageUrl: '',
    imageUrl: undefined,
    symbol: formData.symbol,
  };

  return {
    circles,
    eoaAddress,
    profile,
  };
}
