'use client';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { GroupProfile } from '@circles-sdk/profiles';
import { CirclesSdkContext } from '@/contexts/circlesSdk';
import { TrustRelation, Group } from '@/types';
import { Address } from 'viem';
import { AvatarInterface } from '@circles-sdk/sdk';
import { type Profile } from '@circles-sdk/profiles';
import { useAccount } from 'wagmi';

export default function useCircles() {
  const { circles, groupAvatar, updateGroupAvatar } =
    useContext(CirclesSdkContext);

  // if (!circles) {
  //   throw new Error('useCirclesSdk must be used within a CirclesSDKProvider');
  // }

  const queryClient = useQueryClient();
  // const { address } = useAccount();

  // useEffect(() => {
  //   const getGroupAvatar = async () => {
  //     if (!address || !circles) return;
  //     console.log('fetch group avatar');
  //     console.log('address', address);
  //     console.log('circles', circles);
  //     try {
  //       const groupAvatar = await circles.getAvatar(
  //         // address as string
  //         // TODO delete test data
  //         // '0x3487e4ae480bc5e461a7bcfd5de81513335193e7'
  //         address.toLowerCase()
  //       );
  //       if (groupAvatar) {
  //         setGroupAvatar(groupAvatar);
  //       }
  //     } catch (error) {
  //       console.error('Failed to get group avatar:', error);
  //     }
  //   };
  //   getGroupAvatar();
  // }, [address, circles]);

  // useEffect(() => {
  //   const groupInfo = async () => {
  //     if (!circles) return;
  //     const info = await circles.data.getGroupInfo(groupAvatar?.address);
  //   };
  //   groupInfo();
  // }, [groupAvatar, circles]);

  console.log('===groupAvatar', groupAvatar, groupAvatar?.avatarInfo);

  const findGroupByAddress = useCallback(
    async (address: string): Promise<Group> => {
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
      const _address = address.toLowerCase();
      const queryKey = ['trustRelations', _address];

      const queryFn = async () => {
        const trustRelations = circles?.data.getTrustRelations(_address, 10);

        if (await trustRelations?.queryNextPage()) {
          return trustRelations?.currentPage?.results ?? [];
        } else {
          return [];
        }
      };

      try {
        const data = (
          await queryClient.fetchQuery({ queryKey, queryFn })
        ).filter((row) => row.truster.toLowerCase() === _address); // only trusted by group
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
    async (address: string) => {
      if (!groupAvatar) return;
      try {
        const _address = address.toLowerCase();
        await groupAvatar.trust(_address);
      } catch (error) {
        console.error('Failed to trust:', error);
      }
    },
    [groupAvatar]
  );

  const untrust = useCallback(
    async (address: string) => {
      if (!groupAvatar) return;
      try {
        const _address = address.toLowerCase();
        await groupAvatar.untrust(_address);
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

  return {
    circles,
    findGroupByAddress,
    getTrustRelations,
    registerGroup,
    trust,
    untrust,
    getAvatarInfo,
    getAvatarProfileByAddress,
    groupAvatar,
  };
}
