import ProfilePreview from '@/components/members/ProfilePreview';
import { useMembersStore } from '@/stores/membersStore';

const MemberList = () => {
  const members = useMembersStore((state) => state.members);
  return (
    <div className='w-full mt-5'>
      {members && members.length === 0 ? (
        <p className='text-gray text-center px-2'>No members yet</p>
      ) : (
        <ul className='w-full'>
          {members?.map((member) => (
            <li
              key={member.address}
              className='flex items-center justify-between p-4 py-4 hover:bg-accent/20 hover:cursor-default'
            >
              <ProfilePreview profile={member} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemberList;
