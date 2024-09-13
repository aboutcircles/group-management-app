import ProfilePreview from '@/components/members/ProfilePreview';
import { useMembersStore } from '@/stores/membersStore';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const MemberList = () => {
  const members = useMembersStore((state) => state.members);
  return (
    <div className='w-full mt-5'>
      <div className='flex items-center p-2 font-bold'>
        Member List
        {/* <button className='flex items-center font-light text-sm ml-1 p-1 rounded-full'>
          <ArrowUpTrayIcon
            width={15}
            height={15}
          />
        </button> */}
      </div>
      {members && members.length === 0 ? (
        <p className='text-gray text-center px-2'>No members yet</p>
      ) : (
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
