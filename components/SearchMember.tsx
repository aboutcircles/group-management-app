import { Button, Field, Input, Label } from '@headlessui/react';
import { useState } from 'react';
import { isAddress } from 'viem';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useCircles from '@/hooks/useCircles';
import { Profile } from '@circles-sdk/profiles';
import ProfilePreview from '@/components/ProfilePreview';
import { TrustRelation } from '@/types';

type ProfileWithAddress = Profile & { address: string };

export default function SearchMember({ trusts }: { trusts: TrustRelation[] }) {
  const [address, setAddress] = useState<string>('');
  const [validAddress, setValidAddress] = useState<boolean>(true);
  const { getAvatarProfileByAddress, trust, untrust } = useCircles();
  const [profile, setProfile] = useState<ProfileWithAddress | null>(null);
  const [profileNotFound, setProfileNotFound] = useState<boolean>(false);
  const [alreadyTrusted, setAlreadyTrusted] = useState<boolean>(false);

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

    if (
      trusts.find(
        (trust) => trust.trustee.toLowerCase() === address.toLowerCase()
      )
    ) {
      setAlreadyTrusted(true);
      // TODO: find profile in trusted (when in will be passed/implemented)
    } else {
      setAlreadyTrusted(false);
    }

    const profileInfo = await getAvatarProfileByAddress(address);
    console.log('profileInfo', profileInfo);

    // TODO: check if profile is already in the list
    if (!profileInfo) {
      setProfileNotFound(true);
      setProfile(null);
    } else {
      setProfile({ ...profileInfo, address } as ProfileWithAddress);
      setAddress('');
    }
  };

  const handleTrust = async () => {
    if (!profile) return;
    if (alreadyTrusted) {
      await untrust(profile.address);
    } else {
      await trust(profile.address);
    }
  };

  return (
    <div className='w-full max-w-screen-sm'>
      <form
        onSubmit={handleSearch}
        className='w-full h-full flex flex-col items-center justify-center gap-y-4 p-4 pb-0'
      >
        <Field className='w-full'>
          <Label className='text-sm/6 font-medium text-black px-2'>
            Add member by address
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
          <ProfilePreview profile={profile} />
          <Button
            className='flex items-center bg-accent rounded-full px-3 py-1 hover:bg-accent/90 disabled:bg-accent/50 disabled:hover:bg-accent/50 text-white transition duration-300 ease-in-out'
            onClick={handleTrust}
          >
            {alreadyTrusted ? (
              <>
                Untrust <XMarkIcon className='h-4 w-4 ml-1' />
              </>
            ) : (
              <>
                Trust <PlusIcon className='h-4 w-4 ml-1' />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
