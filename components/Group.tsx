import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo, { Group as GroupType } from './GroupInfo';
import useCircles from '@/hooks/useCircles';
import { useEffect } from 'react';

export default function Group({ group }: { group: GroupType }) {
  const { findGroupByAddress } = useCircles();

  useEffect(() => {
    const fetchGroup = async () => {
      const groups = await findGroupByAddress(
        '0x3487e4ae480bc5e461a7bcfd5de81513335193e7'
      );
      console.log(groups);
    };
    fetchGroup();
  }, [findGroupByAddress]);

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
