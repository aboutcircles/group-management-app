import {
  Config,
  getConnectorClient,
  getConnections,
  Connector,
  GetConnectionsReturnType,
  Connection,
} from '@wagmi/core';
import { UseConnectorClientReturnType } from 'wagmi';
import { BrowserProvider, JsonRpcSigner, Eip1193Provider } from 'ethers';
import type { Account, Chain, Client, Transport } from 'viem';
import { useConnectors } from 'wagmi';

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    // ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner(
  config: Config,
  { chainId }: { chainId?: number } = {},
  connectorClient: UseConnectorClientReturnType
) {
  console.log('config', config);
  const connections = getConnections(config);
  console.log('connections', connections);
  const connector = connections[0] as Connection;
  // console.log('acc', connector.getAccounts());
  // console.log('chainId', connector.getChainId());

  const client = await getConnectorClient(config, {
    chainId,
    connector: connectorClient,
    account: connector.accounts[0],
  });
  // console.log('connector', cli);
  // const client = await getConnectorClient(config, {
  //   chainId,
  //   connector,
  // });
  console.log('client', client);
  return clientToSigner(client);
}
