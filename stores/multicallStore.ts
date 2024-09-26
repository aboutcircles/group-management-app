import { create } from 'zustand';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address } from 'viem';
import { ethers } from 'ethers';
import v2HubABI from '@/abi/HubContract';
import { BaseTransaction } from '@safe-global/safe-apps-sdk';

type MulticallStoreState = {
  isMulticallLoading: boolean;
  error?: string;
};

type MulticallStoreActions = {
  trustMultipleMembers: (
    addresses: Address[],
    trust: boolean
  ) => Promise<boolean>;
  resetMulticallState: () => void;
};

export const useMulticallStore = create<
  MulticallStoreState & MulticallStoreActions
>((set) => ({
  isMulticallLoading: false,
  error: undefined,

  trustMultipleMembers: async (addresses: Address[], trust: boolean) => {
    const circles = useCirclesSdkStore.getState().circles;
    const safeSdk = useCirclesSdkStore.getState().safeSDK;
    const timeExpiry = trust
      ? BigInt('79228162514264337593543950335')
      : BigInt('0');

    if (!circles) {
      set({ error: 'Circles SDK is not initialized' });
      return false;
    }

    if (!safeSdk) {
      set({ error: 'Safe SDK is not initialized' });
      return false;
    }

    set({ isMulticallLoading: true, error: undefined });

    // TODO: temporary, fix multicall when sdk will support it
    set({ isMulticallLoading: false });
    return false;
    // try {
    //     const provider = circles.contractRunner.provider;
    //     const groupAvatarAddress = circles.circlesConfig.v2HubAddress;

    //     if (!groupAvatarAddress) {
    //         set({ error: 'Group avatar address not found' });
    //         set({ isMulticallLoading: false });
    //         return false;
    //     }

    //     const groupAvatarContract = new ethers.Contract(groupAvatarAddress, v2HubABI, provider);

    //     const txs: BaseTransaction[] = [];

    //     addresses.map((address) => {
    //         const callData = groupAvatarContract.interface.encodeFunctionData('trust', [address, timeExpiry]); // expiryDate to define
    //         txs.push({
    //             to: groupAvatarAddress,
    //             value: '0',
    //             data: callData
    //         })
    //     });

    //     const sendTxResponse = await safeSdk.txs.send({ txs });

    //     console.log('Multicall transaction completed:', txs);

    //     return true;
    // } catch (error) {
    //     console.error('Multicall error:', error);
    //     set({ error: 'An error occurred during multicall.' });
    //     return false;
    // } finally {
    //     set({ isMulticallLoading: false });
    // }
  },

  resetMulticallState: () => {
    set({
      isMulticallLoading: false,
      error: undefined,
    });
  },
}));
