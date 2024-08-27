import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo, { Group as GroupType } from './GroupInfo';
import useCircles from '@/hooks/useCircles';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Group() {
  const { address } = useAccount();
  const { findGroupByAddress, getTrustRelations, circles } = useCircles();
  const [group, setGroup] = useState<GroupType | undefined>(undefined);

  console.log('circles from Group', circles);

  useEffect(() => {
    console.log('use effect for Group', circles);
    const fetchGroup = async () => {
      console.log('address', address);
      if (!address) return;
      const group = await findGroupByAddress(
        '0x03F937F2D7B0FbA7BF6a3350F617a8a7560a4F43'
        // address
      );
      console.log('groups', group);
      setGroup(group as GroupType);
      const trustRelations = await getTrustRelations(address);
      //   '0x3487e4ae480bc5e461a7bcfd5de81513335193e7'
      // );
      console.log('trustRelations', trustRelations);
    };
    fetchGroup();
  }, [address, circles, findGroupByAddress, getTrustRelations]);

  if (!group || !circles) return <div>Loading...</div>;

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
        <TabPanel className='h-6'>manage members</TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
