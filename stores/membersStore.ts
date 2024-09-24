import { ProfileWithAddress, RelationType } from '@/types';
import { create } from 'zustand';
import { useGroupStore } from '@/stores/groupStore';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address } from 'viem';

type MembersStore = {
  members?: ProfileWithAddress[];
  trustMember: (profile: ProfileWithAddress) => Promise<boolean>;
  untrustMember: (profile: ProfileWithAddress) => Promise<boolean>;
  isFetched: boolean;
  fetchMembers: () => Promise<void>;
};

export const useMembersStore = create<MembersStore>((set) => ({
  members: [],
  isFetched: false,
  fetchMembers: async () => {
    const groupInfo = useGroupStore.getState().groupInfo;
    const circles = useCirclesSdkStore.getState().circles;

    try {
      const trustRelations = await circles?.data.getAggregatedTrustRelations(
        groupInfo?.group.toLowerCase() as Address
      );

      const trustAddresses: Address[] = [];
      const relations: Record<string, string> = {};

      trustRelations?.forEach((item) => {
        if (item.relation !== RelationType.TrustedBy) {
          trustAddresses.push(item.objectAvatar as Address);
          relations[item.objectAvatar] = item.relation;
        }
      });

      if (trustAddresses.length === 0) {
        set({ members: [], isFetched: true });
        return;
      }

      const avatars = await circles?.data.getAvatarInfos(trustAddresses);
      const cids = avatars
        ?.map((avatar) => avatar?.cidV0)
        .filter((cid) => cid !== undefined);

      const profiles = await circles?.profiles?.getMany(cids as string[]);

      const profilesWithAddress = avatars?.map((avatar) => {
        const profile = profiles?.[avatar.cidV0 as string];
        return { ...profile, address: avatar?.avatar };
      });

      const avatarProfilesWithRelations = profilesWithAddress?.map(
        (profile) => {
          return {
            ...profile,
            relation: relations[profile.address],
          };
        }
      );

      // console.log('avatarProfilesWithRelations', avatarProfilesWithRelations);

      set({
        members: avatarProfilesWithRelations as ProfileWithAddress[],
        isFetched: true,
      });
    } catch (error) {}
  },

  trustMember: async (profile: ProfileWithAddress) => {
    const groupAvatar = useGroupStore.getState().groupAvatar;

    try {
      const result = await groupAvatar?.trust(profile.address);
      if (result) {
        // update relation:
        // TrustedBy -> MutuallyTrusts,
        // if no relation existed -> Trusts
        const newRelation =
          profile.relation === RelationType.TrustedBy
            ? RelationType.MutuallyTrusts
            : RelationType.Trusts;
        const updatedProfile = { ...profile, relation: newRelation };

        set((state) => ({
          members: [
            updatedProfile,
            ...(state.members || []).filter(
              (member) => member.address !== profile.address
            ),
          ],
        }));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  untrustMember: async (profile: ProfileWithAddress) => {
    const groupAvatar = useGroupStore.getState().groupAvatar;
    try {
      const result = await groupAvatar?.untrust(profile.address);

      if (result) {
        // delete profile if no relation left
        if (profile.relation === RelationType.Trusts) {
          set((state) => ({
            members: (state.members || []).filter(
              (member) => member.address !== profile.address
            ),
          }));
        }
        // update relation MutuallyTrusts -> TrustedBy
        if (profile.relation === RelationType.MutuallyTrusts) {
          const updatedProfile = {
            ...profile,
            relation: RelationType.TrustedBy,
          };

          set((state) => ({
            members: [
              updatedProfile,
              ...(state.members || []).filter(
                (member) => member.address !== profile.address
              ),
            ],
          }));
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },
}));
