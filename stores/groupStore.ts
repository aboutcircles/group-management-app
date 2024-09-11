import { Group } from '@/types';
import { CirclesEvent, GroupRow } from '@circles-sdk/data';
import { AvatarInterface, Observable } from '@circles-sdk/sdk';
import { create } from 'zustand';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address } from 'viem';
import { GroupProfile, Profile } from '@circles-sdk/profiles';
import { ContractTransactionReceipt } from 'ethers';
import { cidV0ToUint8Array } from '@circles-sdk/utils';

interface GroupStore {
  groupAvatar?: AvatarInterface;
  groupInfo?: Group;
  avatarEvents?: Observable<CirclesEvent>;
  isLoading: boolean;

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
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groupAvatar: undefined,
  avatarEvents: undefined,
  groupInfo: undefined,
  isLoading: true,

  initGroup: async (address: Address) => {
    set({ isLoading: true });
    const circles = useCirclesSdkStore.getState().circles;
    if (!circles || !address) return;

    console.log('initGroup', address);
    const _address = address.toLowerCase();
    try {
      const avatar = await circles.getAvatar(_address);
      if (!avatar) {
        set({ isLoading: false });
        return;
      }
      const getGroups = circles.data.findGroups(1, {
        groupAddressIn: [_address],
      });

      if (await getGroups?.queryNextPage()) {
        const groupsResult = getGroups?.currentPage?.results ?? [];
        const group = groupsResult[0] as GroupRow; //Group;
        if (!group) {
          throw new Error('Group not found');
        }
        const cid = avatar?.avatarInfo?.cidV0;

        if (!cid) {
          throw new Error('Group profile not found');
        }

        const groupProfile = await circles.profiles?.get(cid);
        set({
          groupAvatar: avatar,
          groupInfo: { ...group, ...groupProfile },
          isLoading: false,
        });
      }
    } catch (error) {
      console.log('Error initializing group', error);
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
}));
