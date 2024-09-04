'use client';

import Fallback from '@/components/Fallback';
import useCircles from '@/hooks/useCircles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Page() {
  const { address } = useAccount();
  const router = useRouter();

  const { groupAvatar } = useCircles();

  useEffect(() => {
    if (!address) return;
    if (!groupAvatar) {
      router.push('/create');
    } else {
      router.push('/group');
    }
  }, [address, router, groupAvatar]);

  return <>{!address && <Fallback />}</>;
}
