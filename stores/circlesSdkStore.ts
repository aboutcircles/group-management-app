import { create } from 'zustand';
import { Sdk } from '@circles-sdk/sdk';
import { BrowserProviderContractRunner } from '@circles-sdk/adapter-ethers';
import { ethers } from 'ethers';
import { CirclesData, CirclesRpc } from '@circles-sdk/data';
import { CIRCLES_RPC, chainConfigGnosis } from '@/const';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';

interface CirclesSdkStore {
  circles?: Sdk;
  circlesData?: CirclesData;
  initSdk: () => Promise<void>;
}

const getSafeProvider = async () => {
  const sdk = new SafeAppsSDK();

  const safeInfo = await sdk.safe.getInfo();
  if (safeInfo) {
    const safeProvider = new SafeAppProvider(safeInfo, sdk);
    return safeProvider;
  } else {
    console.error('Safe info could not be retrieved');
  }
};

export const useCirclesSdkStore = create<CirclesSdkStore>((set, get) => ({
  circles: undefined,
  circlesData: undefined,

  initSdk: async () => {
    const safeProvider = await getSafeProvider();
    if (!safeProvider) return;
    const SafeEthersProvider = new ethers.BrowserProvider(safeProvider);
    const adapter = new BrowserProviderContractRunner();
    adapter.provider = SafeEthersProvider;
    await adapter.init();

    try {
      const circlesSdk = new Sdk(chainConfigGnosis, adapter);
      const circlesRpc = new CirclesRpc(CIRCLES_RPC);
      const data = new CirclesData(circlesRpc);
      set({
        circles: circlesSdk,
        circlesData: data,
      });
    } catch (error) {
      console.error('Failed to initialize Circles SDK:', error);
    }
  },
}));
