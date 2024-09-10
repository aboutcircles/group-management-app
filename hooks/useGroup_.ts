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

  const getTransactionHistory = useCallback(async () => {
    if (!groupAvatar) return;
    console.log('fetching transaction history for group', groupAvatar);
    const txHistoryQuery = await groupAvatar?.getTransactionHistory(25);
    const hasData = await txHistoryQuery.queryNextPage();
    if (hasData) {
      console.log('history', hasData);
      console.log(txHistoryQuery.currentPage?.results);
    }
    return txHistoryQuery;
  }, [groupAvatar]);

  console.log('groupAvatar', groupAvatar);

  const getEvents = useCallback(
    async (blockNumber: number) => {
      const queryKey = ['events', blockNumber];

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
    [circlesData, groupAvatar, queryClient]
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

    findGroupByAddress,
  };
}
