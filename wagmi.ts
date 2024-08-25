import { http, createConfig } from 'wagmi';
import { gnosis, gnosisChiado } from 'wagmi/chains';
import { coinbaseWallet, walletConnect, metaMask } from 'wagmi/connectors';

export const config = createConfig({
  chains: [gnosis, gnosisChiado],
  multiInjectedProviderDiscovery: false,
  // connectors: [safe()],
  connectors: [
    coinbaseWallet({ appName: 'Circles Group Management' }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
    }),
    metaMask(),
  ],
  ssr: true,
  transports: {
    [gnosis.id]: http('https://rpc.gnosischain.com/'),
    [gnosisChiado.id]: http('https://rpc.chiadochain.net'),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
