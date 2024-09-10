import { Group } from '@/types';
import { CirclesEvent, GroupRow } from '@circles-sdk/data';
import { AvatarInterface, Observable } from '@circles-sdk/sdk';
import { create } from 'zustand';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address } from 'viem';

interface GroupStore {
  groupAvatar?: AvatarInterface;
  groupInfo?: Group;
  avatarEvents?: Observable<CirclesEvent>;
  isLoading: boolean;

  initGroup: (address: Address) => Promise<void>;
  setGroupAvatar: (avatar: AvatarInterface) => Promise<void>;
  setGroupInfo: (group: Group) => Promise<void>;
}

export const useGroupStore = create<GroupStore>((set) => ({
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
}));
