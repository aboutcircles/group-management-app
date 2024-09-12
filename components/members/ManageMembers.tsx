import SearchMember from '@/components/members/SearchMember';
import MemberList from '@/components/members/MemberList';
import { useEffect } from 'react';
import { useMembersStore } from '@/stores/membersStore';
import Loading from '@/components/layout/Loading';

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
      {isFetched ? <MemberList /> : <Loading />}
    </div>
  );
}
