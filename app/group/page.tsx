'use client';
import Group from '@/components/Group';
import useCircles from '@/hooks/useCircles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { groupAvatar, subscribeToAvatarEvents } = useCircles();

  useEffect(() => {
    const unsubscribe = subscribeToAvatarEvents();

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
