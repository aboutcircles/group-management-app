'use client';

import { PlusIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel } from '@headlessui/react';
import { useState } from 'react';
import FileUpload from '../group/FileUpload';
import Loader from '../group/Loader';
import { Address } from 'viem';
import Papa from 'papaparse';
import { ProfileWithAddress } from '@/types';

interface BulkTrustProp {
  members: ProfileWithAddress[] | undefined;
}

const BulkTrust = ({ members }: BulkTrustProp) => {
  let [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleFileSelected = (file: File | null) => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data as ProfileWithAddress[];

          const memberAddresses =
            members?.map((member) => member.address) || [];
          const extractedAddresses = parsedData
            .map((row: ProfileWithAddress) => row.address)
            .filter((address) => !memberAddresses.includes(address));

          setAddresses(extractedAddresses);
          console.log('Extracted Addresses:', extractedAddresses);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        },
      });
    }
  };

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
            <FileUpload onFileSelected={handleFileSelected} fileType='csv' />
            <div className='w-full'>
              Upload your{' '}
              <span className='font-bold whitespace-nowrap'>.csv</span> file
              here to trust multiple addresses in one transaction.
            </div>

            <button
              type='submit'
              className='flex items-center bg-gradient-to-r from-accent/90 to-accent/80 rounded-full text-lg px-3 py-1 hover:bg-accent/90 disabled:bg-accent/50 text-white shadow-md hover:shadow-lg transition duration-300 ease-in-out mt-2'
              disabled={addresses.length === 0}
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
