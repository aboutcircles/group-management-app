'use client';

import Fallback from '@/components/Fallback';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Page() {
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push('/create');
    }
  }, [address, router]);

  return <>{!address && <Fallback />}</>;
}
