import GroupInfo, { Group as GroupType } from './GroupInfo';
import useCircles from '@/hooks/useCircles';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function ManageMembers() {
  const { address } = useAccount();
  const { getTrustRelations, circles } = useCircles();
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!address || !circles) return;
      const trustRelations = await getTrustRelations(
        '0x3487e4ae480bc5e461a7bcfd5de81513335193e7'
        // address
      );
      setMembers(trustRelations);
    };
    fetchMembers();
  }, [address, circles, getTrustRelations]);

  if (!members || !circles) return <div>Loading...</div>;

  console.log('members', members);

  return (
    <div className='w-full min-h-[224px]'>
      <ul>
        {members.map((member) => (
          <li key={member.trustee}>{member.trustee}</li>
        ))}
      </ul>
    </div>
  );
}
