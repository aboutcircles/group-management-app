import ProfilePreview from '@/components/members/ProfilePreview';
import { useMulticallStore } from '@/stores/multicallStore';
import { ProfileWithAddress } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Address } from 'viem';
import Loader from '../group/Loader';
import { Pagination } from '@nextui-org/react';

interface MemberListProps {
  members: ProfileWithAddress[] | undefined;
}

const MemberList = ({ members }: MemberListProps) => {
  const [flaggedMembers, setFlaggedMembers] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrusting, setIsTrusting] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 30;
  const totalPages = Math.ceil((members?.length || 0) / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const endIndex = startIndex + membersPerPage;
  const currentMembers = members?.slice(startIndex, endIndex);

  const trustMultipleMembers = useMulticallStore(
    (state) => state.trustMultipleMembers
  );

  const onFlagToggle = (address: Address) => {
    setFlaggedMembers((prev) =>
      prev.includes(address)
        ? prev.filter((a) => a !== address)
        : [...prev, address]
    );
  };

  const handleTrustMultiple = async (trust: boolean) => {
    setIsLoading(true);
    setIsTrusting(trust);
    try {
      await trustMultipleMembers(flaggedMembers, trust);
    } catch (error) {
      console.error('Error trusting members:', error);
    } finally {
      setIsLoading(false);
      setIsTrusting(null);
    }
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      {members && members.length === 0 ? (
        <p className='text-gray text-center px-2'>No members yet</p>
      ) : (
        <>
          <div className='flex flex-col h-5/6'>
            <div className='flex items-center flex-wrap gap-2 p-2'>
              <p className='font-bold p-2 flex-1 text-center sm:text-left'>
                Member List
              </p>
              {flaggedMembers.length > 0 && (
                <div className='flex flex-wrap gap-2 justify-around w-full sm:w-auto px-2'>
                  {/* <button
                  className='flex gap-x-1 items-center bg-accent disabled:hover:bg-accent/50 disabled:bg-accent/50 rounded-full text-white text-sm py-1 px-2 shadow-md hover:bg-accent/90 transition duration-300 ease-in-out'
                  onClick={() => handleTrustMultiple(true)}
                  disabled={isLoading}
                >
                  {isLoading && isTrusting ? (
                    <Loader />
                  ) : (
                    <PlusIcon className='h-5 w-5 stroke-white' />
                  )}
                  Trust {flaggedMembers.length}{' '}
                  {flaggedMembers.length === 1 ? 'member' : 'members'}
                </button> */}

                  <button
                    className='flex gap-x-1 items-center bg-black disabled:hover:bg-black disabled:opacity-50 rounded-full text-white text-sm py-1 px-2 shadow-md hover:bg-accent/90 transition duration-300 ease-in-out'
                    onClick={() => handleTrustMultiple(false)}
                    disabled={isLoading}
                  >
                    {isLoading && !isTrusting ? (
                      <Loader />
                    ) : (
                      <XMarkIcon className='h-5 w-5 stroke-white' />
                    )}
                    Untrust {flaggedMembers.length}{' '}
                    {flaggedMembers.length === 1 ? 'member' : 'members'}
                  </button>
                </div>
              )}
            </div>
            <ul className='w-full overflow-y-auto h-full'>
              {currentMembers?.map((member) => (
                <li
                  key={member.address}
                  className='flex items-center justify-between p-2 hover:bg-accent/20 hover:cursor-default transition duration-300 ease-in-out'
                >
                  <div className='flex items-center w-full'>
                    <input
                      type='checkbox'
                      checked={flaggedMembers.includes(member.address)}
                      onChange={() => onFlagToggle(member.address)}
                      className='mr-2'
                    />
                    <ProfilePreview profile={member} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex justify-end items-center h-1/6 px-2'>
            <Pagination
              isCompact
              showControls
              showShadow
              size='sm'
              color='primary'
              page={currentPage}
              total={totalPages}
              onChange={(page_) => setCurrentPage(page_)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MemberList;
