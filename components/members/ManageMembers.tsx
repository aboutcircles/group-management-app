'use client';

import SearchMember from '@/components/members/SearchMember';
import MemberList from '@/components/members/MemberList';
import { useEffect } from 'react';
import { useMembersStore } from '@/stores/membersStore';
import Loading from '@/components/layout/Loading';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import Papa from 'papaparse';
import BulkTrust from '@/components/members/BulkTrust';
import { Tooltip } from '../common/Tooltip';

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
      <div className='flex flex-col w-full h-1/4'>
        <div className='text-sm font-bold my-4 px-4 text-center sm:text-left w-full'>
          Add/remove member by address
        </div>
        <div className='flex w-full justify-center gap-x-2.5 px-4 flex-wrap-reverse gap-2'>
          <div className='flex-1 w-full'>
            <SearchMember />
          </div>
          <div className='flex items-center h-9 gap-x-2.5 w-full sm:w-auto justify-center self-end'>
            <BulkTrust members={members} />
            {members && (
              <Tooltip content='Export members to CSV' position='left'>
                <button
                  className='flex gap-x-1 items-center rounded-full text-sm p-1.5 hover:shadow-md hover:bg-primary/10 transition duration-300 ease-in-out'
                  onClick={handleExportCSV}
                >
                  <ArrowUpTrayIcon width={18} height={18} />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      <div className='w-full h-3/4 flex'>
        {isFetched ? <MemberList members={members} /> : <Loading />}
      </div>
    </div>
  );
}
