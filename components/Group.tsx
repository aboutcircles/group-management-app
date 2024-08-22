import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo, { Group as GroupType } from './GroupInfo';

export default function Group({ group }: { group: GroupType }) {
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
