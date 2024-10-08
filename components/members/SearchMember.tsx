'use client';

import { Button, Field, Input } from '@headlessui/react';
import { useEffect, useState, useCallback } from 'react';
import { isAddress } from 'viem';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ProfilePreview from '@/components/members/ProfilePreview';
import { ProfileWithAddress } from '@/types';
import { useMembersStore } from '@/stores/membersStore';
import useProfiles from '@/hooks/useProfiles';
import { useDebouncedCallback } from 'use-debounce';

const SearchInput = ({
  address,
  validAddress,
  handleChange,
  handleCleanup,
  profileNotFound,
}: {
  address: string;
  validAddress: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCleanup: () => void;
  profileNotFound: boolean;
}) => (
  <Field className='w-full'>
    <div className='relative'>
      <Input
        required
        type='text'
        name='address'
        value={address}
        placeholder='0x123...'
        className='block w-full rounded-lg border-none bg-black/5 py-1.5 pr-10 pl-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
        onChange={handleChange}
      />
      <Button
        disabled={!address}
        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 transition duration-300 ease-in-out'
        onClick={handleCleanup}
      >
        {address ? (
          <XMarkIcon className='h-5 w-5' />
        ) : (
          <MagnifyingGlassIcon className='h-5 w-5' />
        )}
      </Button>
    </div>
    <p
      className='fixed text-xs text-accent h-4 pl-1 z-10'
      aria-live='assertive'
    >
      {!validAddress && 'Invalid address'}
      {profileNotFound && 'Profile not found'}
    </p>
  </Field>
);

export default function SearchMember() {
  const [address, setAddress] = useState<string>('');
  const [validAddress, setValidAddress] = useState<boolean>(true);
  const { getAvatarProfileByAddress } = useProfiles();
  const [profile, setProfile] = useState<ProfileWithAddress | null>(null);
  const [profileNotFound, setProfileNotFound] = useState<boolean>(false);

  const members = useMembersStore((state) => state.members);

  const validateAddress = (addr: string) => {
    if (!isAddress(addr)) {
      setValidAddress(false);
      return false;
    }
    setValidAddress(true);
    return true;
  };

  const debouncedFetchAddress = useDebouncedCallback(async (addr: string) => {
    console.group('address', addr);
    if (!validateAddress(addr)) return;

    const existingMember = members?.find(
      (member) => member.address.toLowerCase() === addr.toLowerCase()
    );

    if (existingMember) {
      setProfile(existingMember);
      return;
    }

    const profileInfo = await getAvatarProfileByAddress(addr);

    if (!profileInfo) {
      setProfileNotFound(true);
      setProfile(null);
    } else {
      setProfile(profileInfo);
    }
  }, 300);

  useEffect(() => {
    setProfile(null);
    if (address !== '') {
      debouncedFetchAddress(address);
    }
  }, [address, getAvatarProfileByAddress, members]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(event.target.value);
      if (profileNotFound) {
        setProfileNotFound(false);
      }
    },
    [profileNotFound]
  );

  const handleCleanup = useCallback(() => {
    setAddress('');
    setProfile(null);
    setProfileNotFound(false);
    setValidAddress(true);
  }, []);

  return (
    <div className='w-full flex flex-col items-center max-w-screen-sm'>
      <SearchInput
        address={address}
        validAddress={validAddress}
        handleChange={handleChange}
        handleCleanup={handleCleanup}
        profileNotFound={profileNotFound}
      />
      {profile && (
        <div className='w-full flex items-center justify-between'>
          <ProfilePreview profile={profile} cleanup={handleCleanup} full />
        </div>
      )}
    </div>
  );
}
