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
      const group = await findGroupByAddress(
        '0x3487e4ae480bc5e461a7bcfd5de81513335193e7' // works
        // '0xec549ed5ab5c05ffcde00e77115bcb0728f36070'
        // address.toLowerCase() // not working
        // address // also not
      );
      setGroup(group as GroupType);
      const trustRelations = await getTrustRelations(
        '0x3487e4ae480bc5e461a7bcfd5de81513335193e7'
        // address
      );
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
