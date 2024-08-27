import { http, createConfig } from "wagmi";
import { gnosis, gnosisChiado } from "wagmi/chains";
import { safe } from "wagmi/connectors";
import { type SafeParameters } from 'wagmi/connectors'

export const config = createConfig({
  chains: [gnosis, gnosisChiado],
  multiInjectedProviderDiscovery: false,
  connectors: [safe()],
  ssr: true,
  transports: {
    [gnosis.id]: http("https://rpc.gnosischain.com/"),
    [gnosisChiado.id]: http("https://rpc.chiadochain.net"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
