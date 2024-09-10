'use client';

import Fallback from '@/components/layout/Fallback';
import useCircles from '@/hooks/useCircles';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { useGroupStore } from '@/stores/groupStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Page() {
  const { address } = useAccount();
  const router = useRouter();

  // const { circles, groupAvatar, groupAvatarIsFetched } = useCircles();
  const circles = useCirclesSdkStore((state) => state.circles);
  const groupAvatar = useGroupStore((state) => state.groupAvatar);
  const isLoading = useGroupStore((state) => state.isLoading);
  // const groupAvatarIsFetched = useCirclesSdkStore((state) => state.groupAvatarIsFetched);

  console.log('circles', circles);
  console.log('groupAvatar', groupAvatar);
  console.log('isLoading', isLoading);

  useEffect(() => {
    if (!address || !circles || isLoading) return;
    if (!groupAvatar) {
      router.push('/create');
    } else {
      router.push('/group');
    }
  }, [address, router, groupAvatar, circles, isLoading]);

  return <>{!address && <Fallback />}</>;
}
