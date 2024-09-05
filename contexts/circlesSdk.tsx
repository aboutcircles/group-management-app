import { CirclesConfig, Sdk } from '@circles-sdk/sdk';
import { BrowserProviderContractRunner } from '@circles-sdk/adapter-ethers';
import { BrowserProvider, ethers } from 'ethers';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useSafeProvider } from '@/hooks/useSafeProvider';
import { AvatarInterface } from '@circles-sdk/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

interface SDKContextType {
  circles: Sdk | null;
  groupAvatar: AvatarInterface | null | undefined;
  updateGroupAvatar: (newAvatar: AvatarInterface) => void;
  groupAvatarIsFetched: boolean;
}

export const CirclesSdkContext = createContext<SDKContextType>({
  circles: null,
  groupAvatar: null,
  updateGroupAvatar: () => {},
  groupAvatarIsFetched: false,
});

export const CirclesSDKProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [circles, setCircles] = useState<Sdk | null>(null);
  // const [groupAvatar, setGroupAvatar] = useState<AvatarInterface | null>(null);

  const { address } = useAccount();
  const chainId = useChainId();
  const provider = useSafeProvider(); // Get the SafeAppProvider

  useEffect(() => {
    async function initializeSdk() {
      if (!address || !chainId || !provider) return;

      const SafeEthersProvider = new ethers.BrowserProvider(provider);

      const adapter = new BrowserProviderContractRunner();
      adapter.provider = SafeEthersProvider;

      await adapter.init();

      console.log('initializeSdk with SafeAppProvider');
      try {
        const newSdk = new Sdk(chainConfigGnosis, adapter);
        setCircles(newSdk);
        console.log('newSdk initialized with SafeAppProvider', newSdk);
      } catch (error) {
        console.error('Failed to initialize Circles SDK:', error);
      }
    }

    initializeSdk();
  }, [address, chainId, provider]); // Depend on provider

  const {
    data: groupAvatar,
    isLoading,
    isFetched: groupAvatarIsFetched,
    refetch,
  } = useQuery({
    queryKey: ['groupAvatar', address],
    queryFn: async () => {
      if (!address || !circles) {
        return null;
      }
      try {
        const avatar = await circles.getAvatar(address.toLowerCase());
        return avatar || null;
      } catch (error) {
        console.error('Failed to get group avatar:', error);
        return null;
      }
    },
    enabled: !!address && !!circles,
    retry: 3,
    retryDelay: 1000,
  });

  const refetchGroupAvatar = () => {
    refetch();
  };

  return (
    <CirclesSdkContext.Provider
      value={{
        circles,
        groupAvatar,
        groupAvatarIsFetched,
        updateGroupAvatar: refetchGroupAvatar,
      }}
    >
      {children}
    </CirclesSdkContext.Provider>
  );
};
