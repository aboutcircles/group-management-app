'use client';
import Fallback from '@/components/layout/Fallback';
import RegisterGroup from '@/components/group/RegisterGroup';
import { useAccount } from 'wagmi';
import { useSafeProvider } from '@/hooks/useSafeProvider';
import { useEffect } from 'react';
import useCircles from '@/hooks/useCircles';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import TransactionToast from '@/components/layout/TransactionToast';
import { useGroupStore } from '@/stores/groupStore';

export default function Page() {
  const { address } = useAccount();
  // const provider = useSafeProvider();
  const router = useRouter();
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

  // TODO: push to group only if RegisterGroup step is equal to start
  // useEffect(() => {
  //   if (groupAvatar) {
  //     router.push("/group");
  //   }
  // }, [router, groupAvatar]);

  // useEffect(() => {
  //   if (provider) {
  //     console.log('Got SafeAppProvider:', provider);
  //   } else {
  //     console.log('Provider is not yet available.');
  //   }
  // }, [provider]);

  return <>{address ? <RegisterGroup /> : <Fallback />}</>;
}
