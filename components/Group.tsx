import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo from '@/components/GroupInfo';
import useCircles from '@/hooks/useCircles';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ManageMembers from '@/components/ManageMembers';
import { TrustRelation, Group as GroupType } from '@/types';

export default function Group() {
  const { address } = useAccount();
  const { findGroupByAddress, getTrustRelations, circles } = useCircles();
  const [group, setGroup] = useState<GroupType | undefined>(undefined);
  const [trusts, setTrusts] = useState<TrustRelation[]>([]);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!address || !circles) return;
      const group = await findGroupByAddress(address);
      setGroup(group as GroupType);
      const trustRelations = await getTrustRelations(address);
      setTrusts(trustRelations as TrustRelation[]);
    };
    fetchGroup();
  }, [address, circles, findGroupByAddress, getTrustRelations]);

  if (!group || !circles) return <div>Loading...</div>;

  console.log('groups', group);
  console.log('trusts', trusts);

  return (
    <TabGroup>
      <TabList>
        <Tab className='outline-none w-1/2 font-bold bg-secondary text-white data-[selected]:bg-transparent data-[selected]:text-accent data-[hover]:bg-accent data-[hover]:text-white p-4'>
          Group info
        </Tab>
        <Tab className='outline-none w-1/2 font-bold bg-secondary text-white data-[selected]:bg-transparent data-[selected]:text-accent data-[hover]:bg-accent data-[hover]:text-white p-4'>
          Manage group
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <GroupInfo group={group} />
        </TabPanel>
        <TabPanel>
          <ManageMembers trusts={trusts} />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
