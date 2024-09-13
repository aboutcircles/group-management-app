'use client';

import SearchMember from '@/components/members/SearchMember';
import MemberList from '@/components/members/MemberList';
import { useEffect } from 'react';
import { useMembersStore } from '@/stores/membersStore';
import Loading from '@/components/layout/Loading';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import Papa from 'papaparse';
import BulkTrust from './BulkTrust';

export default function ManageMembers() {
  const isFetched = useMembersStore((state) => state.isFetched);
  const members = useMembersStore((state) => state.members);
  const fetchMembers = useMembersStore((state) => state.fetchMembers);

  useEffect(() => {
    if (!isFetched) {
      fetchMembers();
    }
  }, [fetchMembers, isFetched]);

  const handleExportCSV = () => {
    if (!members || members.length === 0) {
      return;
    }

    const csvData = members.map((member) => ({
      name: member.name,
      description: member.description || '',
      previewImageUrl: member.previewImageUrl || '',
      imageUrl: member.imageUrl || '',
      address: member.address,
      relation: member.relation || '',
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
    <div className='w-full min-h-[224px] flex flex-col items-center'>
      <div className='flex w-full h-36 justify-center gap-x-2.5 p-4'>
        <SearchMember />
        <div className='mt-8'>
          <BulkTrust />
        </div>
        {members && (
          <div className='mt-8'>
            <button
              className='flex gap-x-1 items-center rounded-full text-sm p-1.5 hover:shadow-md hover:bg-primary/10 transition duration-300 ease-in-out'
              onClick={handleExportCSV}
            >
              <ArrowUpTrayIcon width={18} height={18} />
            </button>
          </div>
        )}
      </div>
      {isFetched ? <MemberList members={members} /> : <Loading />}
    </div>
  );
}
