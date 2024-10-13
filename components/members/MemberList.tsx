import ProfilePreview from '@/components/members/ProfilePreview';
import { useMulticallStore } from '@/stores/multicallStore';
import { ProfileWithAddress } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Address } from 'viem';
// import { Pagination as PaginationNextUI } from '@nextui-org/react';
import { Button } from '../common/Button';
import { Pagination } from '@/components/common/Pagination';
import { useMembersStore } from '@/stores/membersStore';

interface MemberListProps {
  members: ProfileWithAddress[] | undefined;
}

const MemberList = ({ members }: MemberListProps) => {
  const [flaggedMembers, setFlaggedMembers] = useState<Address[]>([]);
  const [flagAll, setFlagAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isTrusting, setIsTrusting] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;
  const totalPages = Math.ceil((members?.length || 0) / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const endIndex = startIndex + membersPerPage;
  const currentMembers = members?.slice(startIndex, endIndex);

  const fetchMembers = useMembersStore((state) => state.fetchMembers);

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
    try {
      const res = await trustMultipleMembers(flaggedMembers, trust);
      if (res === true) {
        handleFlagAll(false);
      }
    } catch (error) {
      console.error('Error trusting members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlagAll = (flag: boolean) => {
    setFlagAll(flag);
    if (flag) {
      setFlaggedMembers(members?.map((member) => member.address) || []);
    } else {
      setFlaggedMembers([]);
    }
  };

  return (
    <div className='w-full h-full flex flex-col flex-1 justify-between'>
      {members && members.length === 0 ? (
        <p className='text-gray text-center px-2'>No members yet</p>
      ) : (
        <>
          <div className='flex flex-col flex-1 w-full'>
            <div className='flex items-center justify-center flex-wrap gap-2 p-1'>
              <input
                type='checkbox'
                checked={flagAll}
                onChange={() => handleFlagAll(!flagAll)}
                className='mr-2'
              />
              <p className='font-bold p-2 flex-1 text-left'>
                {members?.length} {members?.length === 1 ? 'member' : 'members'}
              </p>
              {flaggedMembers.length > 0 && (
                <Button
                  type='button'
                  handleClick={() => handleTrustMultiple(false)}
                  loading={isLoading}
                  disabled={isLoading}
                  icon={<XMarkIcon className='h-5 w-5 stroke-white' />}
                >
                  Untrust {flaggedMembers.length}{' '}
                  {flaggedMembers.length === 1 ? 'member' : 'members'}
                </Button>
              )}
            </div>
            <ul className='w-full px-1'>
              {currentMembers?.map((member) => (
                <li
                  key={member.address}
                  className='flex items-center border-b border-gray-200'
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

          <div className='flex justify-center items-center pt-5'>
            {/* <PaginationNextUI
              isCompact
              showControls
              showShadow={false}
              size='sm'
              color='primary'
              page={currentPage}
              total={totalPages}
              onChange={(page_) => setCurrentPage(page_)}
            /> */}
            <Pagination
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MemberList;
