'use client';
import { useCallback, useContext } from 'react';
import type { GroupProfile } from '@circles-sdk/profiles';
import { CirclesSdkContext } from '@/contexts/circlesSdk';

export default function useCircles() {
  const { circles } = useContext(CirclesSdkContext);

  // const circles = useContext(CirclesSdkContext) ?? {};

  console.log('circles', circles);

  // if (!circles) {
  //   throw new Error('useCirclesSdk must be used within a CirclesSDKProvider');
  // }

  const findGroupByAddress = useCallback(
    async (address: string) => {
      try {
        const getGroups = circles?.data.findGroups(10, {
          groupAddressIn: [address],
        });

        if (await getGroups?.queryNextPage()) {
          const groupsResult = getGroups?.currentPage?.results ?? [];
          return groupsResult[0];
        }
      } catch (error) {
        console.error('Failed to find group by address:', error);
        return undefined;
      }
    },
    [circles]
  );

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
        const newGroup = await circles?.registerGroupV2(mintPolicy, profile);
        console.log('newGroup', newGroup);
        return newGroup;
      } catch (error) {
        console.error('Failed to register group:', error);
      }
    },
    [circles]
  );

  return {
    circles,
    findGroupByAddress,
    getTrustRelations,
    registerGroup,
  };
}
