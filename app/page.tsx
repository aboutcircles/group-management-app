'use client';

import Fallback from '@/components/Fallback';
import { useAutoConnect } from '@/hooks/useAutoConnect';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// const group = {
//   name: 'Group Test',
//   symbol: 'GRP1',
//   description: 'Group 1 Description',
//   image: 'https://via.placeholder.com/150',
//   balance: '100',
//   members: 108,
// };

const group = null;

export default function Page() {
  const { address } = useAccount();
  const router = useRouter();
  useAutoConnect();

  useEffect(() => {
    if (address) {
      router.push('/create');
    }
  }, [address, router]);

  return <>{!address && <Fallback />}</>;
}
