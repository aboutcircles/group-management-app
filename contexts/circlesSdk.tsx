import { CirclesConfig, Sdk } from '@circles-sdk/sdk';
import { BrowserProvider } from 'ethers';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId, useWalletClient } from 'wagmi';

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

interface SDKContextType {
  circles: Sdk | null;
}

export const CirclesSdkContext = createContext<SDKContextType>({
  circles: null,
});

export const CirclesSDKProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [circles, setCircles] = useState<Sdk | null>(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();

  console.log('CirclesSDKProvider', circles, address, chainId, walletClient);

  const initializeSdk = useCallback(async () => {
    if (!address || !chainId || !walletClient) return;
    const ethersProvider = new BrowserProvider(walletClient);
    console.log('===initializeSdk');

    const signer = await ethersProvider.getSigner();

    console.log('signer', signer);
    try {
      const newSdk = new Sdk(chainConfigGnosis, {
        runner: signer,
        address: address as string,
      });
      setCircles(newSdk);
      console.log('newSdk', newSdk);
    } catch (error) {
      console.error('Failed to initialize Circles SDK:', error);
    }
  }, [address, chainId, walletClient, setCircles]);

  useEffect(() => {
    initializeSdk();
  }, [initializeSdk]);

  console.log('render circles context');

  return (
    <CirclesSdkContext.Provider value={{ circles }}>
      {children}
    </CirclesSdkContext.Provider>
  );
};
