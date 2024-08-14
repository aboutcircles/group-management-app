import SafeAppsSDK from '@safe-global/safe-apps-sdk';

type Opts = {
  allowedDomains?: RegExp[];
  debug?: boolean;
};

const opts: Opts = {
  allowedDomains: [/^app\.safe\.global$/],
  debug: true,
};

const appsSdk = new SafeAppsSDK(opts);

async function getSafeAddress(): Promise<string | undefined> {
  try {
    const safe = await appsSdk.safe.getInfo();
    return safe.safeAddress;
  } catch (error) {
    console.error('Failed to retrieve Safe address:', error);
    return undefined;
  }
}

// Example usage
getSafeAddress().then((address) => {
  if (address) {
    console.log('Safe Address:', address);
  } else {
    console.log('Failed to fetch the Safe address.');
  }
});
