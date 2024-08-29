'use client';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { GroupProfile } from '@circles-sdk/profiles';
import { CirclesSdkContext } from '@/contexts/circlesSdk';
import { TrustRelation, Group } from '@/types';
import { Address } from 'viem';
import { AvatarInterface } from '@circles-sdk/sdk';
import { useAccount } from 'wagmi';

export default function useCircles() {
  const { circles } = useContext(CirclesSdkContext);
  const [groupAvatar, setGroupAvatar] = useState<AvatarInterface | null>(null);

  // if (!circles) {
  //   throw new Error('useCirclesSdk must be used within a CirclesSDKProvider');
  // }

  const queryClient = useQueryClient();
  const { address } = useAccount();

  console.log('groupAvatar', groupAvatar);

  useEffect(() => {
    const getGroupAvatar = async () => {
      if (!address || !circles) return;
      try {
        const groupAvatar = await circles.getAvatar(
          // address as string
          // TODO delete test data
          '0x3487e4ae480bc5e461a7bcfd5de81513335193e7'
        );
        if (groupAvatar) {
          setGroupAvatar(groupAvatar);
        }
      } catch (error) {
        console.error('Failed to get group avatar:', error);
      }
    };
    getGroupAvatar();
  }, [address, circles]);

  const findGroupByAddress = useCallback(
    async (address: string): Promise<Group> => {
      const queryKey = ['groupByAddress', address];

      const queryFn = async () => {
        const getGroups = circles?.data.findGroups(1, {
          groupAddressIn: [address],
        });

        if (await getGroups?.queryNextPage()) {
          const groupsResult = getGroups?.currentPage?.results ?? [];
          return groupsResult[0] as Group;
        } else {
          return {} as Group;
        }
      };

      const data = await queryClient.fetchQuery({ queryKey, queryFn });
      return data;
    },
    [circles, queryClient]
  );

  const getTrustRelations = useCallback(
    async (address: string): Promise<TrustRelation[]> => {
      const queryKey = ['trustRelations', address];

      const queryFn = async () => {
        const trustRelations = circles?.data.getTrustRelations(address, 10);

        if (await trustRelations?.queryNextPage()) {
          return trustRelations?.currentPage?.results ?? [];
        } else {
          return [];
        }
      };

      try {
        const data = (
          await queryClient.fetchQuery({ queryKey, queryFn })
        ).filter((row) => row.truster.toLowerCase() === address.toLowerCase()); // only trusted by group
        return data as TrustRelation[];
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
          setGroupAvatar(newGroupAvatar);
        }
        return newGroupAvatar;
      } catch (error) {
        console.error('Failed to register group:', error);
      }
    },
    [circles]
  );

  // const trust = useCallback(async () => {
  //   (await circles?.getAvatar()).trust();
  //   try {
  //     console.log('creating group...');
  //     const newGroup = await circles?.registerGroupV2(mintPolicy, profile);
  //     console.log('newGroup', newGroup);
  //     return newGroup;
  //   } catch (error) {
  //     console.error('Failed to register group:', error);
  //   }
  // }, [circles]);

  return {
    circles,
    findGroupByAddress,
    getTrustRelations,
    registerGroup,
  };
}
