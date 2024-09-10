import ProfilePreview from '@/components/members/ProfilePreview';
import { useMembersStore } from '@/stores/membersStore';

const MemberList = () => {
  const members = useMembersStore((state) => state.members);
  return (
    <ul className='w-full'>
      {members?.map((member) => (
        <li
          key={member.address}
          className='flex items-center justify-between p-4 py-2 hover:bg-accent/20 hover:cursor-default'
        >
          <ProfilePreview profile={member} />
        </li>
      ))}
    </ul>
  );
};

export default MemberList;
