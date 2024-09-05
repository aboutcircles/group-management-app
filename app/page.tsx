'use client';

import Fallback from '@/components/Fallback';
import useCircles from '@/hooks/useCircles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Page() {
  const { address } = useAccount();
  const router = useRouter();

  const { circles, groupAvatar } = useCircles();

  useEffect(() => {
    if (!address || !circles) return;
    console.log('----------index Page use effect----------');
    console.log('groupAvatar', groupAvatar);
    if (!groupAvatar) {
      console.log('------- redirect to create');
      router.push('/create');
    } else {
      console.log('------- redirect to group');
      router.push('/group');
    }
  }, [address, router, groupAvatar, circles]);

  return <>{!address && <Fallback />}</>;
}
