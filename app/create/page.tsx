'use client';
import Fallback from '@/components/layout/Fallback';
import RegisterGroup from '@/components/group/RegisterGroup';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGroupStore } from '@/stores/groupStore';
import { Step } from '@/types';
import Loading from '@/components/layout/Loading';

export default function Page() {
  const { address } = useAccount();
  const router = useRouter();
  const groupAvatar = useGroupStore((state) => state.groupAvatar);
  const isLoading = useGroupStore((state) => state.isLoading);

  const [step, setStep] = useState<Step>('start');
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    if (!address || isLoading) return;

    if (
      groupAvatar &&
      address?.toLowerCase() !== groupAvatar?.address.toLowerCase()
    )
      return;

    // push to /group only if RegisterGroup step is equal to start
    if (groupAvatar && step === 'start') {
      router.push('/group');
    } else {
      setIsPageReady(true);
    }
  }, [router, groupAvatar, step, address, isLoading]);

  if (!isPageReady) return <Loading />;

  return (
    <>
      {address ? <RegisterGroup step={step} setStep={setStep} /> : <Fallback />}
    </>
  );
}
