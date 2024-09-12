import Image from 'next/image';
import { ProfileWithAddress, RelationType } from '@/types';
import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ArrowsRightLeftIcon,
  // ArrowUpTrayIcon,
  // ArrowDownTrayIcon,
} from '@heroicons/react/20/solid';
import { Tooltip } from '@/components/common/Tooltip';
import { Button } from '@headlessui/react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMembersStore } from '@/stores/membersStore';

export default function ProfilePreview({
  profile,
  setProfile = () => {},
  full = false,
}: {
  profile: ProfileWithAddress;
  setProfile?: (profile: ProfileWithAddress | null) => void;
  full?: boolean;
}) {
  const trustMember = useMembersStore((state) => state.trustMember);
  const untrustMember = useMembersStore((state) => state.untrustMember);

  const handleTrustInSearch = async (profile: ProfileWithAddress) => {
    const result = await trustMember(profile);
    if (result) {
      setProfile(null);
    }
  };

  const handleUntrustInSearch = async (profile: ProfileWithAddress) => {
    const result = await untrustMember(profile);
    if (result) {
      setProfile(null);
    }
  };

  return (
    <div className='flex items-center w-full'>
      <div className='h-5 w-5 mr-2 text-zinc-400'>
        {profile.relation === RelationType.Trusts && (
          <Tooltip content='You trust this profile'>
            <ArrowUpRightIcon className='h-5 w-5' />
          </Tooltip>
        )}
        {profile.relation === RelationType.TrustedBy && (
          <Tooltip content='This profile trusts you'>
            <ArrowDownLeftIcon className='h-5 w-5' />
          </Tooltip>
        )}
        {profile.relation === RelationType.MutuallyTrusts && (
          <Tooltip content='Mutually trust each other'>
            <ArrowsRightLeftIcon className='h-5 w-5' />
          </Tooltip>
        )}
      </div>
      {profile.previewImageUrl ? (
        <Image
          src={profile.previewImageUrl}
          alt={profile.name}
          width={30}
          height={30}
          className='rounded-full'
        />
      ) : (
        <div className='w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold'>
          {profile.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className='flex flex-col flex-1'>
        <div className='ml-2 font-bold'>{profile.name}</div>
        <div className='ml-2 text-xs text-zinc-500 break-all'>
          {profile.address}
        </div>
      </div>
      {profile.relation === RelationType.MutuallyTrusts ||
      profile.relation === RelationType.Trusts ? (
        <Button
          className='flex items-center bg-black rounded-full px-3 py-1 hover:bg-accent/90 disabled:bg-accent/50 disabled:hover:bg-accent/50 text-white transition duration-300 ease-in-out'
          onClick={() => handleUntrustInSearch(profile)}
        >
          {full && <span className='mr-1'>Untrust</span>}
          <XMarkIcon className='h-4 w-4' />
        </Button>
      ) : (
        <Button
          className='flex items-center bg-accent rounded-full px-3 py-1 hover:bg-accent/90 disabled:bg-accent/50 disabled:hover:bg-accent/50 text-white transition duration-300 ease-in-out'
          onClick={() => handleTrustInSearch(profile)}
        >
          {full && <span className='mr-1'>Trust</span>}
          <PlusIcon className='h-4 w-4' />
        </Button>
      )}
    </div>
  );
}
