import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { useGroupStore } from '@/stores/groupStore';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { Address } from 'viem';

export default function CirclesSdk() {
  const { address } = useAccount();

  const initSdk = useCirclesSdkStore((state) => state.initSdk);
  const initGroup = useGroupStore((state) => state.initGroup);

  useEffect(() => {
    if (!address) return;

    const init = async () => {
      const safeAppsSdk = new SafeAppsSDK();
      const safeInfo = await safeAppsSdk.safe.getInfo();
      const safeAddress = safeInfo.safeAddress;
      if (!safeAddress) return;
      try {
        await initSdk();
        await initGroup(safeAddress as Address);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, [address, initSdk, initGroup]);

  return <></>;
}
