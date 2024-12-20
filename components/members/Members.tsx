import Loading from '@/components/layout/Loading';
import ManageMembers from './ManageMembers';
import MemberList from './MemberList';
import { useEffect } from 'react';
import { useMembersStore } from '@/stores/membersStore';

export const Members = () => {
  const isFetched = useMembersStore((state) => state.isFetched);
  const members = useMembersStore((state) => state.members);
  const fetchMembers = useMembersStore((state) => state.fetchMembers);

  useEffect(() => {
    if (!isFetched) {
      fetchMembers();
    }
  }, [fetchMembers, isFetched]);

  return (
    <div className='w-full h-full flex flex-col items-center gap-5'>
      <ManageMembers />
      <div className='w-full justify-center items-center member-list flex-1'>
        {isFetched ? <MemberList members={members} /> : <Loading />}
      </div>
    </div>
  );
};
