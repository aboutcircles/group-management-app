'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel } from '@headlessui/react';
import { useState } from 'react';

const BulkTrust = () => {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className='flex gap-x-1 items-center bg-accent rounded-full text-white text-sm py-1 px-2 shadow-md hover:bg-accent/90 transition duration-300 ease-in-out'
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon width={14} height={14} className='stroke-white' />
        import
      </button>
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
};

export default BulkTrust;
