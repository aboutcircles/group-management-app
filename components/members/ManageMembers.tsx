'use client';

import SearchMember from '@/components/members/SearchMember';
import MemberList from '@/components/members/MemberList';
import { useEffect, useState } from 'react';
import { useMembersStore } from '@/stores/membersStore';
import Loading from '@/components/layout/Loading';
import {
  ArrowUpTrayIcon,
  DocumentPlusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

export default function ManageMembers() {
  let [isOpen, setIsOpen] = useState(false);
  const isFetched = useMembersStore((state) => state.isFetched);
  const fetchMembers = useMembersStore((state) => state.fetchMembers);

  useEffect(() => {
    if (!isFetched) {
      fetchMembers();
    }
  }, [fetchMembers, isFetched]);

  return (
    <div className='w-full min-h-[224px] flex flex-col items-center'>
      <div className='flex w-full h-36 justify-center gap-x-2.5 p-4'>
        <SearchMember />
        <div className='mt-8'>
          <button
            className='flex gap-x-1 items-center bg-accent rounded-full text-white text-sm py-1 px-2 shadow-md hover:bg-accent/90 transition duration-300 ease-in-out'
            onClick={() => setIsOpen(true)}
          >
            <PlusIcon width={14} height={14} className='stroke-white' />
            import
          </button>
        </div>
        <div className='mt-8'>
          <button className='flex gap-x-1 items-center rounded-full text-sm p-1.5 hover:shadow-md transition duration-300 ease-in-out'>
            <ArrowUpTrayIcon width={18} height={18} />
          </button>
        </div>
      </div>
      {isFetched ? <MemberList /> : <Loading />}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className='relative z-50'
      >
        <div className='fixed inset-0 flex bg-black/40 backdrop-blur-sm w-screen items-center justify-center p-4'>
          <DialogPanel className='max-w-lg space-y-4 rounded-lg bg-background text-black p-12'>
            Placeholder for csv bulk file
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
