'use client';

import {
  ArrowRightIcon,
  PlusIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Dialog, DialogPanel } from '@headlessui/react';
import { useState } from 'react';
import ImgUpload from '../group/ImgUpload';
import Loader from '../group/Loader';

const BulkTrust = () => {
  let [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        <div className='fixed inset-0 flex bg-black/50 backdrop-blur-sm w-screen items-center justify-center p-4'>
          <DialogPanel className='flex flex-col items-center max-w-lg rounded-lg bg-background text-black p-4'>
            <div className='flex justify-end w-full'>
              <button className='rounded-full p-1.5 hover:bg-black/10 transition duration-300 ease-in-out'>
                <XMarkIcon
                  width={20}
                  height={20}
                  onClick={() => setIsOpen(false)}
                />
              </button>
            </div>
            <p className='text-lg font-bold'>Bulk Trust</p>
            <ImgUpload />
            <div className='w-full'>
              Upload your{' '}
              <span className='font-bold whitespace-nowrap'>.csv</span> file
              here to trust multiple addresses in one transaction.
            </div>

            <button
              type='submit'
              className='flex items-center bg-gradient-to-r from-accent/90 to-accent/80 rounded-full text-lg px-3 py-1 hover:bg-accent/90 disabled:bg-accent/50 disabled:hover:bg-accent/50 text-white shadow-md hover:shadow-lg transition duration-300 ease-in-out mt-2'
            >
              {isLoading ? (
                <>
                  <div className='mr-2'>
                    <Loader />
                  </div>
                  Processing
                </>
              ) : (
                <>
                  <UserPlusIcon className='h-4 w-4 mr-1' />
                  Trust and Invite
                </>
              )}
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default BulkTrust;
