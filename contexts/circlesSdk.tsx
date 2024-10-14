import { CirclesConfig, Sdk } from '@circles-sdk/sdk';
import { BrowserProviderContractRunner } from '@circles-sdk/adapter-ethers';
import { ethers } from 'ethers';
import React, { createContext, useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useSafeProvider } from '@/hooks/useSafeProvider';
import { AvatarInterface } from '@circles-sdk/sdk';
import { useQuery } from '@tanstack/react-query';
import { Group } from '@/types';
import {
  CirclesData,
  CirclesEvent,
  CirclesRpc,
  Observable,
  type GroupRow,
} from '@circles-sdk/data';

// Gnosis:
export const chainConfigGnosis: CirclesConfig = {
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  circlesRpcUrl: 'https://rpc.helsinki.aboutcircles.com', // https://rpc.falkenstein.aboutcircles.com
  v1HubAddress: '0x29b9a7fbb8995b2423a71cc17cf9810798f6c543',
  v2HubAddress: '0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8',
  migrationAddress: '0xe1dCE89512bE1AeDf94faAb7115A1Ba6AEff4201',
  nameRegistryAddress: '0x738fFee24770d0DE1f912adf2B48b0194780E9AD',
  profileServiceUrl: 'https://chiado-pathfinder.aboutcircles.com/profiles/',
};

interface SDKContextType {
  circles: Sdk | null;
  circlesData: CirclesData | null;
  avatarEvents: Observable<CirclesEvent> | null;
  groupAvatar: AvatarInterface | null | undefined;
  updateGroupAvatar: (newAvatar: AvatarInterface) => void;
  groupAvatarIsFetched: boolean;
  groupInfo: Group | null | undefined;
  groupInfoIsFetched: boolean;
  // adapter: BrowserProviderContractRunner | null;
}

export const CirclesSdkContext = createContext<SDKContextType>({
  circles: null,
  circlesData: null,
  avatarEvents: null,
  groupAvatar: null,
  updateGroupAvatar: () => {},
  groupAvatarIsFetched: false,
  groupInfo: null,
  groupInfoIsFetched: false,
  // adapter: null,
});

export const CirclesSDKProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [circles, setCircles] = useState<Sdk | null>(null);
  const [avatarEvents, setAvatarEvents] =
    useState<Observable<CirclesEvent> | null>(null);
  const [circlesData, setCirclesData] = useState<CirclesData | null>(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const provider = useSafeProvider(); 
  // const [adapter, setAdapter] = useState<BrowserProviderContractRunner | null>(null); // Manage adapter state

  useEffect(() => {
    async function initializeSdk() {
      if (!address || !chainId || !provider) return;

      const SafeEthersProvider = new ethers.BrowserProvider(provider);

      const adapter = new BrowserProviderContractRunner();
      adapter.provider = SafeEthersProvider;

      await adapter.init();
      // setAdapter(adapter);

      console.log('initializeSdk with SafeAppProvider');
      try {
        const newSdk = new Sdk(chainConfigGnosis, adapter);
        const circlesRpc = new CirclesRpc(
          'https://rpc.helsinki.aboutcircles.com'
        );
        const data = new CirclesData(circlesRpc);
        setCirclesData(data);
        const avatarEvents = await data.subscribeToEvents(address);
        setCircles(newSdk);
        setAvatarEvents(avatarEvents);
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

  const {
    data: groupInfo,
    isLoading: groupInfoIsLoading,
    isFetched: groupInfoIsFetched,
    refetch: refetchGroupInfo,
  } = useQuery({
    queryKey: ['groupInfo', address?.toLowerCase()],
    queryFn: async () => {
      if (!address || !circles || !groupAvatar || !groupAvatarIsFetched) {
        return null;
      }
      const _address = address.toLowerCase();
      try {
        const getGroups = circles.data.findGroups(1, {
          groupAddressIn: [_address],
        });

        if (await getGroups?.queryNextPage()) {
          const groupsResult = getGroups?.currentPage?.results ?? [];
          const group = groupsResult[0] as GroupRow; //Group;
          if (!group) {
            throw new Error('Group not found');
          }
          const cid = groupAvatar?.avatarInfo?.cidV0;

          if (!cid) return group; // Return just the group if no avatar CID

          const avatarProfile = await circles.profiles?.get(cid);

          return {
            ...group,
            ...avatarProfile,
          } as Group;
        } else {
          return null;
        }
      } catch (error) {
        console.error('Failed to find group by address:', error);
        return null;
      }
    },
    enabled: !!address && !!circles && !!groupAvatar && groupAvatarIsFetched,
    retry: 3,
    retryDelay: 1000,
  });

  return (
    <CirclesSdkContext.Provider
      value={{
        circles,
        circlesData,
        avatarEvents,
        groupAvatar,
        groupAvatarIsFetched,
        updateGroupAvatar: refetchGroupAvatar,
        groupInfo,
        groupInfoIsFetched,
        // adapter,
      }}
    >
      {children}
    </CirclesSdkContext.Provider>
  );
};
