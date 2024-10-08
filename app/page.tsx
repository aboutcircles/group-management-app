'use client';

import Group from '@/components/group/Group';
import RegisterGroup from '@/components/group/RegisterGroup';
import Fallback from '@/components/layout/Fallback';
import Loading from '@/components/layout/Loading';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { useGroupStore } from '@/stores/groupStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Page() {
  const { address } = useAccount();
  const router = useRouter();

  const circles = useCirclesSdkStore((state) => state.circles);
  const groupAvatar = useGroupStore((state) => state.groupAvatar);
  const isLoading = useGroupStore((state) => state.isLoading);

  if (isLoading && address) return <Loading />;
  if (!address) return <Fallback />;

  if (!groupAvatar) return <RegisterGroup />;
  return <Group />;
}
