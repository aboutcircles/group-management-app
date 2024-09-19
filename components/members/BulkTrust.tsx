'use client';

import {
  CheckIcon,
  PlusIcon,
  UserPlusIcon,
  UserMinusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Dialog, DialogPanel, Tab, TabGroup, TabList } from '@headlessui/react';
import { useEffect, useState } from 'react';
import FileUpload from '../group/FileUpload';
import Loader from '../group/Loader';
import { Address } from 'viem';
import Papa from 'papaparse';
import { ProfileWithAddress } from '@/types';
import { useMulticallStore } from '@/stores/multicallStore';

interface BulkTrustProp {
  members: ProfileWithAddress[] | undefined;
}

const BulkTrust = ({ members }: BulkTrustProp) => {
  const trustMultipleMembers = useMulticallStore(
    (state) => state.trustMultipleMembers
  );
  let [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rawAddresses, setRawAddresses] = useState<Address[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const memberAddresses = members?.map((member) => member.address) || [];

    const filteredAddresses = rawAddresses.filter((address) =>
      selectedIndex === 0
        ? !memberAddresses.includes(address) // Trust: exclude existing members
        : memberAddresses.includes(address)  // Untrust: only include existing members
    );

    setAddresses(filteredAddresses);
  }, [selectedIndex, rawAddresses, members]);

  const handleFileSelected = (file: File | null) => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data as ProfileWithAddress[];
          const extractedAddresses = parsedData.map((row: ProfileWithAddress) => row.address);

          setRawAddresses(extractedAddresses);
          console.log('Extracted Addresses:', extractedAddresses);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        },
      });
    }
  };

  const handleTrustAddresses = async () => {
    setIsLoading(true);

    await trustMultipleMembers(addresses, selectedIndex === 0);

    setIsLoading(false);
    setIsConfirmed(true);
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
            <div className='flex justify-between w-full'>
              <TabGroup
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
              >
                <TabList className='rounded-full bg-black/50 p-1 shadow-inner'>
                  <Tab
                    key={'trust'}
                    className='rounded-full px-2 text-sm/6 font-semibold focus:outline-none text-white data-[selected]:bg-accent data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-accent/90'
                  >
                    Trust
                  </Tab>
                  <Tab
                    key={'untrust'}
                    className='rounded-full  px-3 text-sm/6 font-semibold focus:outline-none text-white data-[selected]:bg-accent data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-accent/90'
                  >
                    Untrust
                  </Tab>
                </TabList>
              </TabGroup>

              <button className='rounded-full p-1.5 hover:bg-black/10 transition duration-300 ease-in-out'>
                <XMarkIcon
                  width={20}
                  height={20}
                  onClick={() => setIsOpen(false)}
                />
              </button>
            </div>
            <p className='text-lg font-bold'>
              {selectedIndex === 0 ? 'Bulk Trust' : 'Bulk Untrust'}
            </p>
            <FileUpload onFileSelected={handleFileSelected} fileType='csv' />
            <div className='w-full'>
              Upload your{' '}
              <span className='font-bold whitespace-nowrap'>.csv</span> file
              here to trust multiple addresses in one transaction.
            </div>

            <button
              type='submit'
              className={`flex items-center rounded-full text-lg px-3 py-1 disabled:bg-accent/50 text-white shadow-md hover:shadow-lg transition duration-300 ease-in-out mt-2 ${
                isConfirmed
                  ? 'bg-secondary/80 hover:bg-secondary/90'
                  : 'bg-gradient-to-r from-accent/90 to-accent/80 hover:bg-accent/90'
              }`}
              disabled={addresses.length === 0}
              onClick={
                isConfirmed ? () => setIsOpen(false) : handleTrustAddresses
              }
            >
              {isLoading ? (
                <>
                  <div className='mr-2'>
                    <Loader />
                  </div>
                  Processing
                </>
              ) : isConfirmed ? (
                <>
                  <CheckIcon className='h-4 w-4 mr-1' />
                  Confirmed
                </>
              ) : (
                <>
                  
                  {selectedIndex === 0 ? (<><UserPlusIcon className='h-4 w-4 mr-1' />Trust and Invite</>) : (<><UserMinusIcon className='h-4 w-4 mr-1' />Untrust</>)}
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
