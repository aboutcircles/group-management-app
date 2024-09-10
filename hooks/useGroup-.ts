import { useQuery } from '@tanstack/react-query';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { useGroupStore } from '@/stores/groupStore';
import { useEffect } from 'react';

export function useGroup(address: string) {
  const circles = useCirclesSdkStore((state) => state.circles);
  const setGroupAvatar = useGroupStore((state) => state.setGroupAvatar);

  const {
    data: groupAvatar,
    isLoading,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ['groupAvatar', address],
    queryFn: async () => {
      if (!address || !circles) {
        return null;
      }
      try {
        const avatar = await circles.getAvatar(address.toLowerCase());
        return avatar;
      } catch (error) {
        console.error('Failed to get group avatar:', error);
        return null;
      }
    },
    enabled: !!address && !!circles,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (groupAvatar && isFetched) {
      setGroupAvatar(groupAvatar);
    }
  }, [groupAvatar, isFetched, setGroupAvatar]);

  return {
    groupAvatar,
    isLoading,
    isFetched,
    refetch,
  };
}
