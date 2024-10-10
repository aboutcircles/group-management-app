'use client';

import MemberList from '@/components/members/MemberList';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMembersStore } from '@/stores/membersStore';
import Loading from '@/components/layout/Loading';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import Papa from 'papaparse';
import BulkTrust from '@/components/members/BulkTrust';
import { Label, TextInput } from 'flowbite-react';
import { Button } from '@/components/common/Button';
import { ProfileWithAddress } from '@/types';
import useProfiles from '@/hooks/useProfiles';
import { SearchResult } from '@/components/members/SearchResult';
import { useDebouncedCallback } from 'use-debounce';
import { isAddress } from 'viem';

export default function ManageMembers() {
  const isFetched = useMembersStore((state) => state.isFetched);
  const members = useMembersStore((state) => state.members);
  const fetchMembers = useMembersStore((state) => state.fetchMembers);
  const [address, setAddress] = useState<string>('');
  const [validAddress, setValidAddress] = useState<boolean>(true);
  const { getAvatarProfileByAddress } = useProfiles();
  const [profile, setProfile] = useState<ProfileWithAddress | null>(null);
  const [profileNotFound, setProfileNotFound] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFetched) {
      fetchMembers();
    }
  }, [fetchMembers, isFetched]);

  const handleChangeSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(event.target.value);
      if (profileNotFound) {
        setProfileNotFound(false);
      }
    },
    [profileNotFound]
  );

  const validateAddress = (addr: string) => {
    if (!isAddress(addr)) {
      setValidAddress(false);
      return false;
    }
    setValidAddress(true);
    return true;
  };

  const debouncedFetchAddress = useDebouncedCallback(async (addr: string) => {
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
    if (address === '') {
      setValidAddress(true);
      setProfileNotFound(false);
    }
  }, [address, debouncedFetchAddress, getAvatarProfileByAddress, members]);

  const handleExportCSV = () => {
    if (!members || members.length === 0) {
      return;
    }

    const csvData = members.map((member) => ({
      address: member.address,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'members.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='w-full h-full flex flex-col items-center justify-between'>
      <Label
        htmlFor='address'
        className='text-sm my-4 px-4 text-center sm:text-left w-full'
      >
        Add/remove member by address
      </Label>
      <div className='flex flex-wrap w-full gap-3 relative items-start'>
        <div className='w-full sm:w-auto flex-1 flex flex-col'>
          <TextInput
            required
            type='search'
            name='address'
            id='address'
            value={address}
            placeholder='0x123...'
            className=''
            onChange={handleChangeSearch}
            ref={inputRef}
          />
          <p
            className='text-xs text-accent h-4 pl-1 z-10'
            aria-live='assertive'
          >
            {!validAddress && 'Invalid address'}
            {profileNotFound && 'Profile not found'}
          </p>
        </div>
        {profile && (
          <>
            <div className='fixed inset-0 bg-black bg-opacity-50 z-40' />
            <div
              className='absolute z-50 mt-1 w-full'
              style={{
                top: inputRef.current ? inputRef.current.offsetHeight + 4 : 0,
                left: 0,
              }}
            >
              <SearchResult
                profile={profile}
                onClose={() => {
                  setAddress('');
                }}
              />
            </div>
          </>
        )}
        <div className='w-full sm:w-auto flex flex-row gap-2 justify-center'>
          <BulkTrust members={members} />
          <Button
            type='button'
            handleClick={handleExportCSV}
            icon={<ArrowUpTrayIcon className='w-5 h-5' />}
          >
            Export CSV
          </Button>
        </div>
      </div>
      <div className='w-full flex justify-center items-center'>
        {isFetched ? <MemberList members={members} /> : <Loading />}
      </div>
    </div>
  );
}
