import { useEffect, useState } from 'react';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';

type Opts = {
  allowedDomains?: RegExp[];
  debug?: boolean;
};

export function useSafe() {
  const [safeAddress, setSafeAddress] = useState<string | undefined>(undefined);
  const [sdk, setSdk] = useState<SafeAppsSDK | undefined>(undefined);

  const [metaMaskAccount, setMetaMaskAccount] = useState<string | null>(null);

  // Function to request accounts from MetaMask
  const requestMetaMaskAccount = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('MetaMask not found');
      }

      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setMetaMaskAccount(accounts[0]); // Set the first account
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  useEffect(() => {
    // This will check if MetaMask is installed and request access
    requestMetaMaskAccount();
  }, []);

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
    }
    set();
  }, []);

  console.log('metaMaskAccount', metaMaskAccount);

  return { safeAddress, sdk, metaMaskAccount };
}
