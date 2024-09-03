import { CirclesConfig, Sdk } from '@circles-sdk/sdk';
import { BrowserProviderContractRunner } from '@circles-sdk/adapter-ethers';
import { BrowserProvider, ethers } from 'ethers';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useSafeProvider } from '@/hooks/useSafeProvider';


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
  const provider = useSafeProvider(); // Get the SafeAppProvider


  useEffect(() => {
    async function initializeSdk() {
      if (!address || !chainId || !provider) return;

      const ethersProvider = new ethers.BrowserProvider(provider);

      const adapter = new BrowserProviderContractRunner();
      adapter.provider = ethersProvider;

      await adapter.init();

      console.log('initializeSdk with SafeAppProvider');

      try {
        const newSdk = new Sdk(chainConfigGnosis, adapter)
        setCircles(newSdk);
        console.log('newSdk initialized with SafeAppProvider', newSdk);
      } catch (error) {
        console.error('Failed to initialize Circles SDK:', error);
      }
    }

    initializeSdk();
  }, [address, chainId, provider]); // Depend on provider


  return (
    <CirclesSdkContext.Provider value={{ circles }}>
      {children}
    </CirclesSdkContext.Provider>
  );
};
