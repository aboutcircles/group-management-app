import { create } from 'zustand';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address } from 'viem';
import { ethers } from 'ethers';
import v2HubABI from '@/abi/HubContract';
import { BaseTransaction } from '@safe-global/safe-apps-sdk';
import { useMembersStore } from './membersStore';

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
    const fetchMembers = useMembersStore.getState().fetchMembers;
    
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

    try {
      const provider = circles.contractRunner.provider;
      const groupAvatarAddress = circles.circlesConfig.v2HubAddress;

      if (!groupAvatarAddress) {
        set({ error: 'Group avatar address not found' });
        set({ isMulticallLoading: false });
        return false;
      }

      const groupAvatarContract = new ethers.Contract(
        groupAvatarAddress,
        v2HubABI,
        provider
      );

      const txs: BaseTransaction[] = [];

      addresses.map((address) => {
        const callData = groupAvatarContract.interface.encodeFunctionData(
          'trust',
          [address, timeExpiry]
        ); // expiryDate to define
        txs.push({
          to: groupAvatarAddress,
          value: '0',
          data: callData,
        });
      });

      const sendTxResponse = await safeSdk.txs.send({ txs });

      const checkTransactionStatus = async (): Promise<boolean> => {
        const safeTx = await safeSdk.txs.getBySafeTxHash(sendTxResponse.safeTxHash);
        if (safeTx.txStatus === "SUCCESS") {
          console.log('Transaction confirmed:', safeTx);
          return true;
        } else if (safeTx.txStatus === "AWAITING_CONFIRMATIONS") {
          console.log('Transaction awaiting confirmations...');
          return false;
        } else {
          console.error('Transaction failed:', safeTx);
          set({ error: 'Transaction failed.' });
          return false;
        }
      };

      const waitForConfirmation = async (): Promise<boolean> => {
        let isConfirmed = false;
        while (!isConfirmed) {
          isConfirmed = await checkTransactionStatus();
          if (!isConfirmed) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
        return isConfirmed;
      };

      const transactionConfirmed = await waitForConfirmation();

      if (transactionConfirmed) {
        console.log('All transactions confirmed, fetching updated members...');
        await fetchMembers();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Multicall error:', error);
      set({ error: 'An error occurred during multicall.' });
      return false;
    } finally {
      set({ isMulticallLoading: false });
    }
  },

  resetMulticallState: () => {
    set({
      isMulticallLoading: false,
      error: undefined,
    });
  },
}));
