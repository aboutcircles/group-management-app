'use client';
import Group from '@/components/group/Group';

import Loading from '@/components/layout/Loading';
import { useGroupStore } from '@/stores/groupStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Page() {
  const groupAvatar = useGroupStore((state) => state.groupAvatar);
  const groupInfo = useGroupStore((state) => state.groupInfo);
  const { address } = useAccount();

  const router = useRouter();

  useEffect(() => {
    if (!groupAvatar) {
      router.push('/create');
    }
  }, [router, groupAvatar]);

  if (address?.toLowerCase() !== groupInfo?.group.toLowerCase()) {
    return <Loading />;
  }

  return <Group />;
}
