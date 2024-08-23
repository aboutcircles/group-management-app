import { SdkContractRunner, TransactionRequest, TransactionResponse } from '@circles-sdk/adapter';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { getBrowserProvider,getSigner } from './WagmiEthers';
import { getChainId } from './WagmiEthers';

export class SafeSdkContractRunner implements SdkContractRunner {
    private safeSdk: SafeAppsSDK;
    private sdkContractRunner: SdkContractRunner;
  
    constructor(safeSdk: SafeAppsSDK, sdkContractRunner: SdkContractRunner) {
      this.safeSdk = safeSdk;
      this.sdkContractRunner = sdkContractRunner;
    }
  
    address: Promise<string> = (async () => {
      const provider = getBrowserProvider();
      const signer = await getSigner();
      return await signer.getAddress();
      const network = getChainId();
    })();
  
    async estimateGas(tx: TransactionRequest): Promise<bigint> {
      if (this.sdkContractRunner.estimateGas) {
        return this.sdkContractRunner.estimateGas(tx);
      }
      // Handle cases where estimateGas is not supported
      throw new Error('estimateGas method not supported by the SDK');
    }
  
    async call(tx: TransactionRequest): Promise<string> {
      if (this.sdkContractRunner.call) {
        return this.sdkContractRunner.call(tx);
      }
      // Handle cases where call is not supported
      throw new Error('call method not supported by the SDK');
    }
  
    async resolveName(name: string): Promise<string | null> {
      if (this.sdkContractRunner.resolveName) {
        return this.sdkContractRunner.resolveName(name);
      }
      // Handle cases where resolveName is not supported
      return null;
    }
  
    async sendTransaction(tx: TransactionRequest): Promise<TransactionResponse> {
      if (!this.sdkContractRunner.sendTransaction) {
        throw new Error('sendTransaction method not supported by the SDK');
      }
  
      // Send the transaction using the SafeAppsSDK
      const txResponse = await this.safeSdk.txs.send({
        txs: [
          {
            to: tx.to as string,
            value: tx.value ? tx.value.toString() : '0',
            data: tx.data ? tx.data.toString() : '0x',
          },
        ],
      });
  
      // Fetch the transaction details using the transaction hash
      const provider = getBrowserProvider();
      const ethersResponse = await provider.getTransaction(txResponse.safeTxHash);
  
      if (!ethersResponse) {
        throw new Error('Transaction not found');
      }

      const chainId = Number(await getChainId());
  
      // Return a properly formatted TransactionResponse
      return {
        blockNumber: ethersResponse.blockNumber ?? 0, // Default to 0 if null
        blockHash: ethersResponse.blockHash ?? '0x', // Default to '0x' if null
        hash: ethersResponse.hash,
        index: ethersResponse.index,
        type: ethersResponse.type ?? 0, // Default to 0 if null
        to: ethersResponse.to ?? '0x', // Default to '0x' if null
        from: ethersResponse.from,
        gasLimit: BigInt(ethersResponse.gasLimit.toString()), // Convert BigNumber to bigint
        gasPrice: BigInt(ethersResponse.gasPrice.toString()), // Convert BigNumber to bigint
        data: ethersResponse.data ?? '0x', // Default to '0x' if null
        value: BigInt(ethersResponse.value.toString()), // Convert BigNumber to bigint
        chainId: chainId,
      };
    }
  }