import { ProfileWithAddress } from '@/types';
import SearchMember from '@/components/members/SearchMember';
import MemberList from '@/components/members/MemberList';
import useCircles from '@/hooks/useCircles';
import { RelationType } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export default function ManageMembers({
  members,
  setMembers,
}: {
  members: ProfileWithAddress[];
  setMembers: Dispatch<SetStateAction<ProfileWithAddress[]>>;
}) {
  const { untrust, trust } = useCircles();

  const handleUntrust = async (
    profile: ProfileWithAddress
  ): Promise<boolean> => {
    const result = await untrust(profile.address);
    console.log('result untrust', result);
    if (result) {
      // delete profile if no relation left
      if (profile.relation === RelationType.Trusts) {
        setMembers((prevMembers: ProfileWithAddress[]) =>
          prevMembers.filter((member) => member.address !== profile.address)
        );
      }
      // update relation MutuallyTrusts -> TrustedBy
      if (profile.relation === RelationType.MutuallyTrusts) {
        const updatedProfile = { ...profile, relation: RelationType.TrustedBy };

        setMembers((prevMembers: ProfileWithAddress[]) => [
          updatedProfile,
          ...prevMembers.filter((member) => member.address !== profile.address),
        ]);
      }
      return true;
    }
    return false;
  };

  const handleTrust = async (profile: ProfileWithAddress): Promise<boolean> => {
    const result = await trust(profile.address);
    console.log('result trust', result);
    if (result) {
      // update relation:
      // TrustedBy -> MutuallyTrusts,
      // if no relation existed -> Trusts
      const newRelation =
        profile.relation === RelationType.TrustedBy
          ? RelationType.MutuallyTrusts
          : RelationType.Trusts;
      const updatedProfile = { ...profile, relation: newRelation };
      setMembers((prevMembers: ProfileWithAddress[]) => [
        updatedProfile,
        ...prevMembers.filter((member) => member.address !== profile.address),
      ]);
      return true;
    }
    return false;
  };

  return (
    <div className='w-full min-h-[224px] flex flex-col items-center'>
      <SearchMember
        members={members}
        handleTrust={handleTrust}
        handleUntrust={handleUntrust}
      />
      <h2 className='mt-5 pl-6 text-sm/6 font-medium text-black px-2 self-start'>
        Members
      </h2>
      {members.length > 0 ? (
        <MemberList
          members={members}
          handleTrust={handleTrust}
          handleUntrust={handleUntrust}
        />
      ) : (
        <p className='text-sm/6 text-zinc/50 px-2'>No members yet</p>
      )}
    </div>
  );
}
