import { create } from 'zustand';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address, multicall3Abi } from 'viem';
import { ethers } from 'ethers';
import v2HubABI from '@/abi/HubContract';
import multicallABI from '@/abi/Multicall';

type MulticallStoreState = {
    isMulticallLoading: boolean;
    error?: string;
};

type MulticallStoreActions = {
    trustMultipleMembers: (addresses: Address[]) => Promise<boolean>;
    resetMulticallState: () => void;
};

export const useMulticallStore = create<MulticallStoreState & MulticallStoreActions>((set) => ({
    isMulticallLoading: false,
    error: undefined,

    trustMultipleMembers: async (addresses: Address[]) => {
        const circles = useCirclesSdkStore.getState().circles;

        if (!circles) {
            set({ error: 'Circles SDK is not initialized' });
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

            const multicallContractAddress = '0xcA11bde05977b3631167028862bE2a173976CA11';


            const multicallContract = new ethers.Contract(multicallContractAddress, multicallABI, provider);

            const groupAvatarContract = new ethers.Contract(circles.circlesConfig.v2HubAddress, v2HubABI, provider);

            const trustCalls = addresses.map((address) => {
                const callData = groupAvatarContract.interface.encodeFunctionData('trust', [address.toLowerCase(), 0]);
                return {
                    target: groupAvatarAddress,
                    callData,
                };
            });

            const tx = await multicallContract.aggregate(trustCalls);
            await tx.wait();

            console.log('Multicall transaction completed:', tx);

            return true;
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
