'use client';

import {
  PlusIcon,
  UserPlusIcon,
  UserMinusIcon,
} from '@heroicons/react/24/outline';
import { HiCheck, HiOutlineX } from 'react-icons/hi';
import { Dialog, DialogPanel, Tab, TabGroup, TabList } from '@headlessui/react';
import { useEffect, useState } from 'react';
import FileUpload from '../group/FileUpload';
import Loader from '../common/Loader';
import { Address } from 'viem';
import Papa from 'papaparse';
import { ProfileWithAddress } from '@/types';
import { useMulticallStore } from '@/stores/multicallStore';
import { Button } from '@/components/common/Button';

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

    const filteredAddresses = rawAddresses.filter(
      (address) =>
        selectedIndex === 0
          ? !memberAddresses.includes(address.toLowerCase() as Address) // Trust: exclude existing members
          : memberAddresses.includes(address.toLowerCase() as Address) // Untrust: only include existing members
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
          const extractedAddresses = parsedData.map(
            (row: ProfileWithAddress) => row.address
          );

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

  const closeModal = () => {
    setIsOpen(false);
    setIsConfirmed(false);
    setSelectedIndex(0);
  };

  return (
    <>
      <Button
        type='button'
        handleClick={() => setIsOpen(true)}
        icon={<PlusIcon className='w-5 h-5' />}
      >
        Import
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => closeModal()}
        className='relative z-50'
      >
        <div className='fixed inset-0 flex bg-black/50 backdrop-blur-sm w-screen items-center justify-center p-4'>
          <DialogPanel className='flex flex-col items-center max-w-lg rounded-lg bg-background text-black p-4'>
            <div className='flex justify-between w-full items-center'>
              <TabGroup
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
              >
                <TabList className='rounded-md bg-black/50 p-1 shadow-inner'>
                  <Tab
                    key={'trust'}
                    className='rounded-md px-3 py-2 text-sm/6 font-semibold focus:outline-none text-white data-[selected]:bg-accent data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-accent/90'
                  >
                    Trust
                  </Tab>
                  <Tab
                    key={'untrust'}
                    className='rounded-md  px-3 py-2 text-sm/6 font-semibold focus:outline-none text-white data-[selected]:bg-accent data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-accent/90'
                  >
                    Untrust
                  </Tab>
                </TabList>
              </TabGroup>

              <button className='rounded-full p-1.5 hover:bg-black/10 transition duration-300 ease-in-out'>
                <HiOutlineX
                  width={20}
                  height={20}
                  onClick={() => closeModal()}
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

            <Button
              type='submit'
              disabled={addresses.length === 0 && !isConfirmed}
              handleClick={
                isConfirmed ? () => closeModal() : handleTrustAddresses
              }
              loading={isLoading}
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
                  <HiCheck className='h-5 w-5' />
                  Confirmed
                </>
              ) : (
                <>
                  {selectedIndex === 0 ? (
                    <>
                      <UserPlusIcon className='h-5 w-5 mr-2' />
                      Trust and Invite
                    </>
                  ) : (
                    <>
                      <UserMinusIcon className='h-5 w-5 mr-2' />
                      Untrust
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default BulkTrust;
