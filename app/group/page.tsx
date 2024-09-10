'use client';
import Group from '@/components/group/Group';
import TransactionToast from '@/components/layout/TransactionToast';
import useCircles from '@/hooks/useCircles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Page() {
  const { groupAvatar, subscribeToAvatarEvents } = useCircles();

  useEffect(() => {
    const unsubscribe = subscribeToAvatarEvents((event) => {
      if (event && event.transactionHash) {
        toast(<TransactionToast transactionHash={event.transactionHash} />);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [subscribeToAvatarEvents]);

  const router = useRouter();

  useEffect(() => {
    if (!groupAvatar) {
      router.push('/create');
    }
  }, [router, groupAvatar]);

  return <Group />;
}
