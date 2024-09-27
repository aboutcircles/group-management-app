import { create } from 'zustand';
import { Sdk } from '@circles-sdk/sdk';
import { BrowserProviderContractRunner } from '@circles-sdk/adapter-ethers';
import { ethers } from 'ethers';
import { CirclesData, CirclesRpc } from '@circles-sdk/data';
import { CIRCLES_RPC, chainConfigGnosis } from '@/const';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';

interface CirclesSdkStoreState {
  circles?: Sdk;
  circlesData?: CirclesData;
  safeSDK?: SafeAppsSDK;
  adapter?: BrowserProviderContractRunner;
}

interface CirclesSdkStoreActions {
  initSdk: () => Promise<void>;
  setAdapterProvider: (provider: ethers.BrowserProvider) => void;
  resetSdk: () => Promise<void>;
}

const initialState: CirclesSdkStoreState = {
  circles: undefined,
  circlesData: undefined,
  safeSDK: undefined,
  adapter: undefined,
};

const getSafeProvider = async (sdk: SafeAppsSDK) => {
  const safeInfo = await sdk.safe.getInfo();
  if (safeInfo) {
    const safeProvider = new SafeAppProvider(safeInfo, sdk);
    return safeProvider;
  } else {
    console.error('Safe info could not be retrieved');
    return null;
  }
};

export const useCirclesSdkStore = create<
  CirclesSdkStoreState & CirclesSdkStoreActions
>((set, get) => ({
  circles: undefined,
  circlesData: undefined,
  safeSDK: undefined,
  adapter: undefined,

  initSdk: async () => {
    const sdk = new SafeAppsSDK();
    const safeProvider = await getSafeProvider(sdk);
    if (!safeProvider) return;

    const SafeEthersProvider = new ethers.BrowserProvider(safeProvider);
    const adapter = new BrowserProviderContractRunner();
    adapter.provider = SafeEthersProvider; 

    await adapter.init();

    try {
      await adapter.init();  // Initialize the adapter after setting the provider

      // Initialize Circles SDK with the adapter
      const circlesSdk = new Sdk(chainConfigGnosis, adapter);
      const circlesRpc = new CirclesRpc(CIRCLES_RPC);
      const data = new CirclesData(circlesRpc);

      set({
        circles: circlesSdk,
        circlesData: data,
        safeSDK: sdk,
        adapter: adapter, // Optionally store the adapter in Zustand state
      });
    } catch (error) {
      console.error('Failed to initialize Circles SDK:', error);
    }
  },

  // Function to set adapter provider
  setAdapterProvider: (provider: ethers.BrowserProvider) => {
    const adapter = get().adapter;
    if (adapter) {
      adapter.provider = provider;
    } else {
      console.error('Adapter is not initialized');
    }
  },

  resetSdk: async () => {
    set(initialState);
  },
}));

