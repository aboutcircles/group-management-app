'use client';
import Group from '@/components/group/Group';
import { useGroupStore } from '@/stores/groupStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const groupAvatar = useGroupStore((state) => state.groupAvatar);
  // const { groupAvatar, subscribeToAvatarEvents } = useCircles();

  // useEffect(() => {
  //   const unsubscribe = subscribeToAvatarEvents((event) => {
  //     if (event && event.transactionHash) {
  //       toast(<TransactionToast transactionHash={event.transactionHash} />);
  //     }
  //   });

  //   return () => {
  //     if (unsubscribe) {
  //       unsubscribe();
  //     }
  //   };
  // }, [subscribeToAvatarEvents]);

  const router = useRouter();

  useEffect(() => {
    if (!groupAvatar) {
      router.push('/create');
    }
  }, [router, groupAvatar]);

  return <Group />;
}
