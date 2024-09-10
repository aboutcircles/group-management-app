import { Button, Field, Input, Label } from '@headlessui/react';
import { useState } from 'react';
import { isAddress } from 'viem';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import useCircles from '@/hooks/useCircles';
import ProfilePreview from '@/components/members/ProfilePreview';
import { ProfileWithAddress } from '@/types';

export default function SearchMember({
  members,
  handleTrust,
  handleUntrust,
}: {
  members: ProfileWithAddress[];
  handleTrust: (profile: ProfileWithAddress) => Promise<boolean>;
  handleUntrust: (profile: ProfileWithAddress) => Promise<boolean>;
}) {
  const [address, setAddress] = useState<string>('');
  const [validAddress, setValidAddress] = useState<boolean>(true);
  const { getAvatarProfileByAddress } = useCircles();
  const [profile, setProfile] = useState<ProfileWithAddress | null>(null);
  const [profileNotFound, setProfileNotFound] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
    if (profileNotFound) {
      setProfileNotFound(false);
    }
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAddress(address)) {
      setValidAddress(false);
      return;
    }
    setValidAddress(true);

    const existingMember = members.find(
      (member) => member.address.toLowerCase() === address.toLowerCase()
    );

    if (existingMember) {
      setProfile(existingMember);
      setAddress('');
      return;
    }

    // if not in the member list:
    const profileInfo = await getAvatarProfileByAddress(address);

    if (!profileInfo) {
      setProfileNotFound(true);
      setProfile(null);
    } else {
      setProfile({ ...profileInfo, address } as ProfileWithAddress);
      setAddress('');
    }
  };

  const handleTrustInSearch = async (profile: ProfileWithAddress) => {
    const result = await handleTrust(profile);
    if (result) {
      setProfile(null);
    }
  };

  const handleUntrustInSearch = async (profile: ProfileWithAddress) => {
    const result = await handleUntrust(profile);
    if (result) {
      setProfile(null);
    }
  };
  // const handleTrustInSearch = async (
  //   profile: ProfileWithAddress,
  //   action: 'trust' | 'untrust'
  // ) => {
  //   const result =
  //     action === 'trust'
  //       ? await handleTrust(profile)
  //       : await handleUntrust(profile);
  //   if (result) {
  //     setProfile(null);
  //   }
  // };

  return (
    <div className='w-full max-w-screen-sm'>
      <form
        onSubmit={handleSearch}
        className='w-full h-full flex flex-col items-center justify-center gap-y-4 p-4 pb-0'
      >
        <Field className='w-full'>
          <Label className='text-sm/6 font-medium text-black px-2'>
            Add/remove member by address
          </Label>
          <div className='relative mt-1'>
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
              type='submit'
              disabled={!address}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 transition duration-300 ease-in-out'
            >
              <MagnifyingGlassIcon className='h-4 w-4' />
            </Button>
          </div>
          <p className='text-xs text-accent h-4 pl-1'>
            {!validAddress && 'Invalid address'}
            {profileNotFound && 'Profile not found'}
          </p>
        </Field>
      </form>
      {profile && (
        <div className='w-full flex items-center justify-between p-4 pt-0'>
          <ProfilePreview
            profile={profile}
            handleTrust={handleTrustInSearch}
            handleUntrust={handleUntrustInSearch}
            full
          />
        </div>
      )}
    </div>
  );
}
