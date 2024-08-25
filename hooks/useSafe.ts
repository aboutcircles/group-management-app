import { useEffect, useState } from 'react';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';

type Opts = {
  allowedDomains?: RegExp[];
  debug?: boolean;
};

export function useSafe() {
  const [safeAddress, setSafeAddress] = useState<string | undefined>(undefined);
  const [safeOwners, setSafeOwners] = useState<string[] | undefined>(undefined);
  const [sdk, setSdk] = useState<SafeAppsSDK | undefined>(undefined);

  useEffect(() => {
    async function set() {
      const opts: Opts = {
        allowedDomains: [
          /^app\.safe\.global$/,
          /^https:\/\/terms_date--walletweb\.review\.5afe\.dev$/,
        ],
        debug: true,
      };
      const appsSdk = new SafeAppsSDK(opts);
      console.log('appsSdk', appsSdk);
      setSdk(appsSdk);
      const safe = await appsSdk.safe.getInfo();
      console.log('safe', safe);
      setSafeAddress(safe.safeAddress);
      setSafeOwners(safe.owners);
    }
    set();
  }, []);

  return {
    safeAddress,
    sdk,
    safeOwners,
    //  metaMaskAccount
  };
}
