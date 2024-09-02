import { useState, useEffect } from 'react';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';
import { useAccount } from 'wagmi';

export function useSafeProvider() {
  const { address, isConnected } = useAccount();
  const [provider, setProvider] = useState<SafeAppProvider | null>(null);

  useEffect(() => {
    async function initializeProvider() {
      try {
        if (isConnected && address) {
          const sdk = new SafeAppsSDK();

          const safeInfo = await sdk.safe.getInfo();
          if (safeInfo) {
  
            const safeProvider = new SafeAppProvider(safeInfo, sdk);
            setProvider(safeProvider);
          } else {
            console.error('Safe info could not be retrieved');
          }
        }
      } catch (error) {
        console.error('Error initializing Safe provider:', error);
      }
    }

    initializeProvider();
  }, [address, isConnected]);

  return provider;
}