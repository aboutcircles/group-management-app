import { TrustRelation } from '@/types';
import SearchMember from '@/components/SearchMember';

export default function ManageMembers({ trusts }: { trusts: TrustRelation[] }) {
  return (
    <div className='w-full min-h-[224px] flex flex-col items-center'>
      <SearchMember trusts={trusts} />
      <ul>
        {trusts.map((member) => (
          <li key={member.trustee}>{member.trustee}</li>
        ))}
      </ul>
    </div>
  );
}
