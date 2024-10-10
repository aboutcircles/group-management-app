'use client';

import Image from 'next/image';
import { ProfileWithAddress, RelationType } from '@/types';
import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { HiOutlinePlusSm, HiOutlineX } from 'react-icons/hi';
import { Tooltip } from '@/components/common/Tooltip';
import { IconButton } from '@/components/common/IconButton';
import { Button } from '@/components/common/Button';
import { useMembersStore } from '@/stores/membersStore';
import { useState } from 'react';

export default function ProfilePreview({
  profile,
  cleanup = () => {},
  full = false,
}: {
  profile: ProfileWithAddress;
  cleanup?: () => void;
  full?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const trustMember = useMembersStore((state) => state.trustMember);
  const untrustMember = useMembersStore((state) => state.untrustMember);

  const handleTrustInSearch = async (profile: ProfileWithAddress) => {
    setIsLoading(true);
    const result = await trustMember(profile);
    if (result) {
      cleanup();
    }
    setIsLoading(false);
  };

  const handleUntrustInSearch = async (profile: ProfileWithAddress) => {
    setIsLoading(true);
    const result = await untrustMember(profile);
    if (result) {
      cleanup();
    }
    setIsLoading(false);
  };

  return (
    <div className='flex items-center w-full py-4'>
      <div className='flex flex-col-reverse sm:flex-row gap-2 items-center'>
        <div className='h-5 w-5 text-zinc-400'>
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
          <div className='w-[30px] h-[30px] min-w-[30px] min-h-[30px] text-gray-900 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold'>
            {profile.name ? profile.name.charAt(0).toUpperCase() : ''}
          </div>
        )}
      </div>
      <div className='flex flex-col flex-1'>
        <div className='mx-2'>
          <span
            className={`font-bold ${
              profile.name ? 'break-words' : 'break-all'
            }`}
          >
            {profile.name ? profile.name : profile.address}
          </span>
          <span className='text-xs text-accent ml-2'>
            {profile.symbol && 'group'}
          </span>
        </div>
        <div className='mx-2 text-xs text-zinc-500 break-all'>
          {profile.name ? profile.address : 'v1 profile'}
        </div>
      </div>
      {full ? (
        <Button
          type='button'
          loading={isLoading}
          icon={
            profile.relation === RelationType.MutuallyTrusts ||
            profile.relation === RelationType.Trusts ? (
              <HiOutlineX className='h-5 w-5' />
            ) : (
              <HiOutlinePlusSm className='h-5 w-5' />
            )
          }
          handleClick={() =>
            profile.relation === RelationType.MutuallyTrusts ||
            profile.relation === RelationType.Trusts
              ? handleUntrustInSearch(profile)
              : handleTrustInSearch(profile)
          }
        >
          {profile.relation === RelationType.MutuallyTrusts ||
          profile.relation === RelationType.Trusts ? (
            <>{full && <span className='mr-1'>Untrust</span>}</>
          ) : (
            <>{full && <span className='mr-1'>Trust</span>}</>
          )}
        </Button>
      ) : (
        <IconButton
          type='button'
          icon={
            profile.relation === RelationType.MutuallyTrusts ||
            profile.relation === RelationType.Trusts ? (
              <HiOutlineX className='h-5 w-5' />
            ) : (
              <HiOutlinePlusSm className='h-5 w-5' />
            )
          }
          handleClick={() =>
            profile.relation === RelationType.MutuallyTrusts ||
            profile.relation === RelationType.Trusts
              ? handleUntrustInSearch(profile)
              : handleTrustInSearch(profile)
          }
          loading={isLoading}
        />
      )}
    </div>
  );
}
