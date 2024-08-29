import { TrustRelation } from '@/types';

export default function ManageMembers({ trusts }: { trusts: TrustRelation[] }) {
  return (
    <div className='w-full min-h-[224px]'>
      <ul>
        {trusts.map((member) => (
          <li key={member.trustee}>{member.trustee}</li>
        ))}
      </ul>
    </div>
  );
}
