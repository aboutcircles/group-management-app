import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Profile } from '@circles-sdk/profiles';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function useProfiles() {
  const circles = useCirclesSdkStore((state) => state.circles);
  const queryClient = useQueryClient();

  const getAvatarProfileByAddress = useCallback(
    async (address: string): Promise<Profile | null> => {
      const _address = address.toLowerCase();
      const queryKey = ['avatarProfile', _address];

      const queryFn = async () => {
        if (!circles) return;
        try {
          const avatarInfo = await circles.getAvatar(_address);
          const cid = avatarInfo?.avatarInfo?.cidV0;
          // console.log('cid', cid);
          if (!cid) return null;
          const avatarProfile = await circles.profiles?.get(cid);
          // console.log('avatarProfile', avatarProfile);
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
    getAvatarProfileByAddress,
  };
}
