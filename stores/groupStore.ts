import { Group } from '@/types';
import { CirclesEvent, GroupRow } from '@circles-sdk/data';
import { AvatarInterface, Observable } from '@circles-sdk/sdk';
import { create } from 'zustand';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address } from 'viem';
import { GroupProfile, Profile } from '@circles-sdk/profiles';
import { ContractTransactionReceipt, ethers } from 'ethers';
import { cidV0ToUint8Array } from '@circles-sdk/utils';

interface GroupStoreState {
  groupAvatar: AvatarInterface | null;
  groupInfo: Group | null;
  avatarEvents: Observable<CirclesEvent> | null;
  isLoading: boolean;
  totalSupply: bigint;
  isHumanAvatar: boolean;
}

interface GroupStoreActions {
  initGroup: (address: Address) => Promise<void>;
  setGroupAvatar: (avatar: AvatarInterface) => Promise<void>;
  setGroupInfo: (group: Group) => Promise<void>;

  createGroup: (
    mintPolicy: Address,
    groupData: GroupProfile
  ) => Promise<AvatarInterface | null>;

  updateGroup: (
    newProfile: Profile
  ) => Promise<ContractTransactionReceipt | null>;

  resetGroup: () => Promise<void>;
  fetchTotalSupply: () => Promise<void>;
}

const initialState: GroupStoreState = {
  groupAvatar: null,
  avatarEvents: null,
  groupInfo: null,
  isLoading: true,
  totalSupply: BigInt(0),
  isHumanAvatar: false,
};

export const useGroupStore = create<GroupStoreState & GroupStoreActions>(
  (set, get) => ({
    ...initialState,

    initGroup: async (address: Address) => {
      set({ isLoading: true });
      const circles = useCirclesSdkStore.getState().circles;
      if (!circles || !address) return;

      const _address = address.toLowerCase();

      try {
        const avatar = await circles.getAvatar(_address);
        if (!avatar) {
          set({ ...initialState, isLoading: false });
          return;
        }

        const isHuman = avatar.avatarInfo?.type === "CrcV2_RegisterHuman";

        if (isHuman) {
          set({
            ...initialState,
            isLoading: false,
            isHumanAvatar: true,
          });
          return;
        }

        const getGroups = circles.data.findGroups(1, {
          groupAddressIn: [_address],
        });

        if (await getGroups?.queryNextPage()) {
          const groupsResult = getGroups?.currentPage?.results ?? [];
          const group = groupsResult[0] as GroupRow; //Group;
          console.log('group', group);
          if (!group) {
            throw new Error('Group not found');
          }
          const cid = avatar?.avatarInfo?.cidV0;

          if (!cid) {
            throw new Error('Group profile not found');
          }

          console.log('cid', cid);
          const groupProfile = await circles.profiles?.get(cid);
          console.log('groupProfile', groupProfile);

          const totalSupply = await avatar.getTotalSupply();
          // console.log('totalSupply', ethers.formatEther(totalSupply));

          set({
            groupAvatar: avatar,
            groupInfo: { ...group, ...groupProfile },
            totalSupply: totalSupply || BigInt(0),
            // totalSupply: BigInt(0),
            isLoading: false,
            isHumanAvatar: false,
          });
        }
      } catch (error) {
        console.log('Error initializing group', error);
        set({ ...initialState, isLoading: false });
      } finally {
        set({ isLoading: false });
      }
    },

    setGroupAvatar: async (avatar: AvatarInterface) =>
      set({ groupAvatar: avatar }),

    setGroupInfo: async (group: Group) => set({ groupInfo: group }),

    createGroup: async (mintPolicy: Address, groupData: GroupProfile) => {
      const profile: GroupProfile = {
        name: groupData.name,
        description: groupData.description,
        previewImageUrl: groupData.previewImageUrl,
        imageUrl: groupData.imageUrl,
        symbol: groupData.symbol,
      };

      const circles = useCirclesSdkStore.getState().circles;
      if (!circles || !mintPolicy) return null;

      try {
        console.log('creating group...');
        const newGroupAvatar = await circles?.registerGroupV2(
          mintPolicy,
          profile
        );
        console.log('newGroup', newGroupAvatar);
        if (newGroupAvatar) {
          await get().initGroup(newGroupAvatar.address as Address);
          return newGroupAvatar;
        } else {
          return null;
        }
      } catch (error) {
        console.error('Failed to register group:', error);
        return null;
      }
    },

    updateGroup: async (newProfile: Profile) => {
      const circles = useCirclesSdkStore.getState().circles;
      if (!circles) return null;

      try {
        const cid = await circles.profiles?.create(newProfile);

        if (!cid) {
          throw new Error('Failed to create profile: CID is undefined');
        }
        const digest = cidV0ToUint8Array(cid);

        if (!circles.nameRegistry) {
          throw new Error('Circles SDK nameRegistry context is not available.');
        }
        const tx = await circles.nameRegistry.updateMetadataDigest(digest);

        if (!tx) {
          throw new Error(
            'Failed to create the transaction for updating metadata digest.'
          );
        }

        const receipt = await tx.wait();
        console.log('Profile updated successfully:', receipt);
        return receipt;
      } catch (error) {
        console.error('Error while updating profile:', error);
        return null;
      }
    },

    resetGroup: async () => {
      set(initialState);
    },

    fetchTotalSupply: async () => {
      try {
        const totalSupply = await get().groupAvatar?.getTotalSupply();
        set({
          totalSupply: totalSupply || BigInt(0),
        });
      } catch (error) {
        console.error('Error fetching total supply:', error);
      }
      set({ totalSupply: BigInt(0) });
    },
  })
);
