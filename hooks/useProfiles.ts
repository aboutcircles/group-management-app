import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { ProfileWithAddress } from '@/types';
import { Profile } from '@circles-sdk/profiles';
import { Avatar } from '@circles-sdk/sdk';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function useProfiles() {
  const circles = useCirclesSdkStore((state) => state.circles);
  const queryClient = useQueryClient();

  const getAvatarProfileByAddress = useCallback(
    async (address: string): Promise<ProfileWithAddress | null> => {
      const _address = address.toLowerCase();
      const queryKey = ['avatarProfile', _address];

      const queryFn = async () => {
        if (!circles) return;

        let cid;
        try {
          const avatar = await circles.getAvatar(_address);
          cid = avatar.avatarInfo?.cidV0;
        } catch (error) {
          console.error('Failed to get avatar info:', error);
          return null;
        }

        try {
          const avatarProfile = await circles.profiles?.get(cid as string);
          if (!avatarProfile) return { address: _address };
          return { ...avatarProfile, address: _address };
        } catch (error) {
          console.error('Failed to get avatar profile:', error);
          return null;
        }
      };

      try {
        const data = await queryClient.fetchQuery({ queryKey, queryFn });
        return data as ProfileWithAddress;
      } catch (error) {
        console.error('Failed to get avatar profile:', error);
        return null;
      }
    },
    [circles, queryClient]
  );

  const getAvatar = useCallback(
    async (address: string): Promise<Avatar | null> => {
      const _address = address.toLowerCase();
      const queryKey = ['avatar', _address];

      const queryFn = async () => {
        if (!circles) return;
        try {
          const avatarInfo = await circles.getAvatar(_address);
          console.log('avatarInfo', avatarInfo);
          return avatarInfo;
        } catch (error) {
          console.error('Failed to get avatar for address:', address, error);
          return null;
        }
      };

      try {
        const data = await queryClient.fetchQuery({ queryKey, queryFn });
        return data as Avatar;
      } catch (error) {
        console.error('Failed to get avatar for address:', address, error);
        return {} as Avatar;
      }
    },
    [circles, queryClient]
  );

  return {
    getAvatarProfileByAddress,
    getAvatar,
  };
}
