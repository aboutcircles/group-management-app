'use client';

import Group from '@/components/group/Group';
import RegisterGroup from '@/components/group/RegisterGroup';
import Fallback from '@/components/layout/Fallback';
import Loading from '@/components/layout/Loading';
import { useGroupStore } from '@/stores/groupStore';
import { useAccount } from 'wagmi';

export default function Page() {
  const { address } = useAccount();
  const groupAvatar = useGroupStore((state) => state.groupAvatar);
  const isLoading = useGroupStore((state) => state.isLoading);

  if (isLoading && address) return <Loading />;
  if (!address) return <Fallback />;
  if (!groupAvatar) return <RegisterGroup />;
  return <Group />;
}
