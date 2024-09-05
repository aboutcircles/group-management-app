'use client';
import Group from '@/components/Group';
import useCircles from '@/hooks/useCircles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { groupAvatar } = useCircles();
  const router = useRouter();

  useEffect(() => {
    console.log('----------group Page use effect----------');
    if (!groupAvatar) {
      console.log('------- redirect to create');
      router.push('/create');
    }
  }, [router, groupAvatar]);

  return <Group />;
}
