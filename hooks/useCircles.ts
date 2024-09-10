'use client';
import { useCallback, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { GroupProfile } from '@circles-sdk/profiles';
import { CirclesSdkContext } from '@/contexts/circlesSdk';
import { Group, ProfileWithAddress } from '@/types';
import { Address } from 'viem';
import { AvatarInterface, TrustRelationRow } from '@circles-sdk/sdk';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { type Profile } from '@circles-sdk/profiles';
import { ContractTransactionReceipt } from 'ethers';
import {
  CirclesEvent,
  CirclesQuery,
  TransactionHistoryRow,
} from '@circles-sdk/data';

export default function useCircles() {
  const {
    circles,
    circlesData,
    avatarEvents,
    groupAvatar,
    groupAvatarIsFetched,
    updateGroupAvatar,
    groupInfo,
    groupInfoIsFetched,
  } = useContext(CirclesSdkContext);

  // if (!circles) {
  //   throw new Error('useCirclesSdk must be used within a CirclesSDKProvider');
  // }

  const queryClient = useQueryClient();

  const subscribeToAvatarEvents = useCallback(
    (onEvent: (event: CirclesEvent) => void) => {
      if (!avatarEvents) {
        console.error('Avatar events not found');
        return;
      }

      const unsubscribe = avatarEvents.subscribe((event) => {
        console.log('Transaction completed:', event);
        onEvent(event);
      });

      return () => {
        unsubscribe();
        console.log('Unsubscribe from avatar events');
      };
    },
    [avatarEvents]
  );

  const findGroupByAddress = useCallback(
    async (address: string): Promise<Group | null> => {
      const _address = address.toLowerCase();
      const queryKey = ['groupByAddress', _address];

      const queryFn = async () => {
        const getGroups = circles?.data.findGroups(1, {
          groupAddressIn: [_address],
        });

        if (await getGroups?.queryNextPage()) {
          const groupsResult = getGroups?.currentPage?.results ?? [];
          return groupsResult[0] as Group;
        } else {
          return null;
        }
      };

      try {
        const data = await queryClient.fetchQuery({ queryKey, queryFn });
        return data;
      } catch (error) {
        console.error('Failed to get group by address:', error);
        return null;
      }
    },
    [circles, queryClient]
  );

  const getTrustRelations = useCallback(
    async (address: string): Promise<TrustRelationRow[]> => {
      const _address = address.toLowerCase();
      const queryKey = ['trustRelations', _address];

      const queryFn = async () => {
        const trustRelations = await circles?.data.getAggregatedTrustRelations(
          _address
        );
        return trustRelations;
      };

      try {
        const data = await queryClient.fetchQuery({ queryKey, queryFn });
        return data as TrustRelationRow[];
      } catch (error) {
        console.error('Failed to get trust relations:', error);
        return [];
      }
    },
    [circles, queryClient]
  );

  const registerGroup = useCallback(
    async (mintPolicy: string, groupData: GroupProfile) => {
      const profile: GroupProfile = {
        name: groupData.name,
        description: groupData.description,
        previewImageUrl: groupData.previewImageUrl,
        imageUrl: groupData.imageUrl,
        symbol: groupData.symbol,
      };

      try {
        console.log('creating group...');
        const newGroupAvatar = await circles?.registerGroupV2(
          mintPolicy,
          profile
        );
        console.log('newGroup', newGroupAvatar);
        if (newGroupAvatar) {
          updateGroupAvatar(newGroupAvatar);
        }
        return newGroupAvatar;
      } catch (error) {
        console.error('Failed to register group:', error);
      }
    },
    [circles, updateGroupAvatar]
  );

  const trust = useCallback(
    async (
      address: string
    ): Promise<ContractTransactionReceipt | undefined> => {
      if (!groupAvatar) return;
      try {
        const _address = address.toLowerCase();
        const result = await groupAvatar.trust(_address);
        return result;
      } catch (error) {
        console.error('Failed to trust:', error);
      }
    },
    [groupAvatar]
  );

  const untrust = useCallback(
    async (
      address: string
    ): Promise<ContractTransactionReceipt | undefined> => {
      if (!groupAvatar) return;
      try {
        const _address = address.toLowerCase();
        return await groupAvatar.untrust(_address);
      } catch (error) {
        console.error('Failed to untrust:', error);
      }
    },
    [groupAvatar]
  );

  const getAvatarInfo = useCallback(
    async (address: string): Promise<AvatarInterface> => {
      const _address = address.toLowerCase();
      const queryKey = ['avatarInfo', _address];

      const queryFn = async () => {
        if (!circles) return;
        try {
          const avatarInfo = await circles.getAvatar(_address);
          return avatarInfo;
        } catch (error) {
          console.error('Failed to get avatar info:', error);
          return {} as AvatarInterface;
        }
      };

      try {
        const data = await queryClient.fetchQuery({ queryKey, queryFn });
        return data as AvatarInterface;
      } catch (error) {
        console.error('Failed to get avatar info:', error);
        return {} as AvatarInterface;
      }
    },
    [circles, queryClient]
  );

  const getAvatarsInfos = useCallback(
    async (contactAddresses: Address[]): Promise<AvatarInterface[]> => {
      const queryKey = ['avatarInfos', contactAddresses];

      const queryFn = async () => {
        if (!circles) return [] as AvatarInterface[];
        try {
          const avatars = await circles.data.getAvatarInfos(contactAddresses);
          console.log('avatars', avatars);
          return avatars;
        } catch (error) {
          console.error("Failed to get avatars' infos:", error);
          return [];
        }
      };

      try {
        const data = await queryClient.fetchQuery({ queryKey, queryFn });
        return data as AvatarInterface[];
      } catch (error) {
        console.error("Failed to get avatars' infos:", error);
        return [];
      }
    },
    [circles, queryClient]
  );

  const getAvatarProfileByAddress = useCallback(
    async (address: string): Promise<Profile | null> => {
      const _address = address.toLowerCase();
      const queryKey = ['avatarProfile', _address];

      const queryFn = async () => {
        if (!circles) return;
        try {
          const avatarInfo = await circles.getAvatar(_address);
          const cid = avatarInfo?.avatarInfo?.cidV0;
          console.log('cid', cid);
          if (!cid) return null;
          const avatarProfile = await circles.profiles?.get(cid);
          console.log('avatarProfile', avatarProfile);
          return avatarProfile;
        } catch (error) {
          console.error('Failed to get avatar profile:', error);
          return null;
        }
      };

      try {
        const data = await queryClient.fetchQuery({ queryKey, queryFn });
        return data as Profile;
      } catch (error) {
        console.error('Failed to get avatar profile:', error);
        return {} as Profile;
      }
    },
    [circles, queryClient]
  );

  const getAvatarsProfilesByAddresses = useCallback(
    async (contactAddresses: Address[]): Promise<ProfileWithAddress[]> => {
      const queryKey = ['avatarProfilesByAddresses', contactAddresses];

      const queryFn = async () => {
        if (!circles || contactAddresses.length === 0) return [];
        try {
          const avatars = await circles.data.getAvatarInfos(contactAddresses);
          const cids = avatars
            .map((avatar) => avatar?.cidV0)
            .filter((cid) => cid !== undefined);
          if (cids.length === 0) return [];
          const profiles = await circles.profiles?.getMany(cids);
          // return profiles;

          if (!profiles) return [];

          const profilesWithAddress = avatars.map((avatar) => {
            const profile = profiles[avatar.cidV0 as string];
            return { ...profile, address: avatar?.avatar };
          });

          return profilesWithAddress;
        } catch (error) {
          console.error('Failed to get avatar profiles:', error);
          return [];
        }
      };

      try {
        const data = await queryClient.fetchQuery({ queryKey, queryFn });
        return data as ProfileWithAddress[];
      } catch (error) {
        console.error('Failed to get avatar profiles:', error);
        return [];
      }
    },
    [circles, queryClient]
  );

  // const getTransactionHistory =
  //   useCallback(async (): Promise<CirclesQuery<TransactionHistoryRow> | null> => {
  //     const queryKey = ['transactionHistory'];

  //     const queryFn = async () => {
  //       if (!groupAvatar) return;
  //       console.log('fetching transaction history for group', groupAvatar);
  //       const txHistoryQuery = await groupAvatar?.getTransactionHistory(25);
  //       return txHistoryQuery;
  //     };

  //     try {
  //       const txHistoryQuery = await queryClient.fetchQuery({
  //         queryKey,
  //         queryFn,
  //       });
  //       return txHistoryQuery as CirclesQuery<TransactionHistoryRow>;
  //     } catch (error) {
  //       console.error('Failed to get avatar info:', error);
  //       return null;
  //     }
  //   }, [groupAvatar, queryClient]);

  // const getTransactionHistory =
  //   useCallback(async (): Promise<CirclesQuery<TransactionHistoryRow> | null> => {
  //     const queryKey = ['transactionHistory'];

  //     const queryFn = async () => {
  //       if (!groupAvatar) return;
  //       console.log('fetching transaction history for group', groupAvatar);
  //       const txHistoryQuery = await groupAvatar?.getTransactionHistory(25);
  //       const hasData = await txHistoryQuery.queryNextPage();
  //       if (hasData) {
  //         console.log(txHistoryQuery.currentPage?.results);
  //       }
  //       return txHistoryQuery;
  //     };

  //     try {
  //       const txHistoryQuery = await queryClient.fetchQuery({
  //         queryKey,
  //         queryFn,
  //       });
  //       return txHistoryQuery as CirclesQuery<TransactionHistoryRow>;
  //     } catch (error) {
  //       console.error('Failed to get avatar info:', error);
  //       return null;
  //     }
  //   }, [groupAvatar, queryClient]);

  const getTransactionHistory = useCallback(async () => {
    if (!groupAvatar) return null;
    console.log('fetching transaction history for group', groupAvatar);
    const txHistoryQuery = await groupAvatar?.getTransactionHistory(25);
    const hasData = await txHistoryQuery.queryNextPage();
    if (hasData) {
      console.log(txHistoryQuery.currentPage?.results);
    }
    return txHistoryQuery;
  }, [groupAvatar]);

  const getEvents = useCallback(
    async (blockNumber: number) => {
      const _blockNumber = blockNumber ?? groupInfo?.blockNumber;
      const queryKey = ['events', _blockNumber];

      const queryFn = async () => {
        if (!groupAvatar) return;
        const events = await circlesData?.getEvents(
          groupAvatar?.address,
          blockNumber
        );
        console.log('events', events);
        return events;
      };

      try {
        const data = await queryClient.fetchQuery({ queryKey, queryFn });
        return data;
      } catch (error) {
        console.error('Failed to get events:', error);
        return null;
      }
    },
    [circlesData, groupAvatar, groupInfo?.blockNumber, queryClient]
  );

  return {
    circles,
    groupAvatar,
    groupAvatarIsFetched,
    groupInfo,
    groupInfoIsFetched,

    registerGroup,
    trust,
    untrust,

    subscribeToAvatarEvents,
    getTransactionHistory,
    getEvents,

    findGroupByAddress,
    getTrustRelations,

    getAvatarInfo,
    getAvatarProfileByAddress,
    getAvatarsInfos,
    getAvatarsProfilesByAddresses,
  };
}
