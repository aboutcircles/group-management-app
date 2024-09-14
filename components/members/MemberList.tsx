import ProfilePreview from '@/components/members/ProfilePreview';
import { useMembersStore } from '@/stores/membersStore';
import { ProfileWithAddress } from '@/types';

interface MemberListProps {
  members: ProfileWithAddress[] | undefined;
}

const MemberList = ({ members }: MemberListProps) => {
  return (
    <div className='w-full mt-5'>
      {members && members.length === 0 ? (
        <p className='text-gray text-center px-2'>No members yet</p>
      ) : (
        <>
          <p className='font-bold p-2'>Member List</p>
          <ul className='w-full'>
            {members?.map((member) => (
              <li
                key={member.address}
                className='flex items-center justify-between p-4 py-4 hover:bg-accent/20 hover:cursor-default transition duration-300 ease-in-out'
              >
                <ProfilePreview profile={member} />
              </li>
            ))}
          </ul>
        </>
      )}
      {/* <div className='w-full flex justify-center'>
        Export list
        <ArrowUpTrayIcon
          width={15}
          height={15}
          className='stroke-primary ml-2'
        />
      </div> */}
    </div>
  );
};

export default MemberList;
