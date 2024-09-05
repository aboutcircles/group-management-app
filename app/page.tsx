'use client';

import Fallback from '@/components/Fallback';
import useCircles from '@/hooks/useCircles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Page() {
  const { address } = useAccount();
  const router = useRouter();

  const { circles, groupAvatar, groupAvatarIsFetched } = useCircles();

  useEffect(() => {
    if (!address || !circles || !groupAvatarIsFetched) return;
    if (!groupAvatar) {
      router.push('/create');
    } else {
      router.push('/group');
    }
  }, [address, router, groupAvatar, circles, groupAvatarIsFetched]);

  return <>{!address && <Fallback />}</>;
}
