import SearchMember from '@/components/members/SearchMember';
import MemberList from '@/components/members/MemberList';
import { useEffect } from 'react';
import { useMembersStore } from '@/stores/membersStore';

export default function ManageMembers() {
  const isFetched = useMembersStore((state) => state.isFetched);
  const fetchMembers = useMembersStore((state) => state.fetchMembers);

  useEffect(() => {
    if (!isFetched) {
      fetchMembers();
    }
  }, [fetchMembers, isFetched]);

  return (
    <div className='w-full min-h-[224px] flex flex-col items-center'>
      <SearchMember />
      {/* <h2 className='mt-5 pl-6 text-sm/6 font-medium text-black px-2 self-start'>
        Members
      </h2> */}
      <MemberList />
    </div>
  );
}
