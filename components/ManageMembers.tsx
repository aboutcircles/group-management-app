import { ProfileWithAddress } from '@/types';
import SearchMember from '@/components/SearchMember';
import ProfilePreview from '@/components/ProfilePreview';
import { Button, Label } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useCircles from '@/hooks/useCircles';
import { Address } from 'viem';

export default function ManageMembers({
  members,
  setMembers,
}: {
  members: ProfileWithAddress[];
  setMembers: (members: ProfileWithAddress[]) => void;
}) {
  const { untrust } = useCircles();

  const handleUntrust = async (address: Address) => {
    const result = await untrust(address);
    console.log('result untrust', result);
    if (result) {
      setMembers(members.filter((member) => member.address !== address));
    }
  };

  return (
    <div className='w-full min-h-[224px] flex flex-col items-center'>
      <SearchMember members={members} setMembers={setMembers} />
      <h2 className='mt-5 pl-6 text-sm/6 font-medium text-black px-2 self-start'>
        Members
      </h2>
      <ul className='w-full'>
        {members.map((member) => (
          <li
            key={member.address}
            className='flex items-center justify-between p-4 py-2 hover:bg-accent/20 hover:cursor-default'
          >
            <ProfilePreview profile={member} />
            <Button
              className='flex items-center bg-black rounded-full px-3 py-1 hover:bg-accent/90 disabled:bg-accent/50 disabled:hover:bg-accent/50 text-white transition duration-300 ease-in-out'
              onClick={() => handleUntrust(member.address)}
            >
              <XMarkIcon className='h-4 w-4' />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
