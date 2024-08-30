import { TrustRelation } from '@/types';
import AddMember from '@/components/AddMember';

export default function ManageMembers({ trusts }: { trusts: TrustRelation[] }) {
  return (
    <div className='w-full min-h-[224px] flex flex-col items-center'>
      <AddMember />
      <ul>
        {trusts.map((member) => (
          <li key={member.trustee}>{member.trustee}</li>
        ))}
      </ul>
    </div>
  );
}
