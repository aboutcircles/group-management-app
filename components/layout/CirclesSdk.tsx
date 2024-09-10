import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { useGroupStore } from '@/stores/groupStore';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function CirclesSdk() {
  const { address } = useAccount();
  const initSdk = useCirclesSdkStore((state) => state.initSdk);
  const initGroup = useGroupStore((state) => state.initGroup);

  useEffect(() => {
    if (!address) return;

    const init = async () => {
      try {
        await initSdk();
        await initGroup(address);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, [initSdk, address, initGroup]);

  return <></>;
}
