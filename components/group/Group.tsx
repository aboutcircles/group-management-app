import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo from '@/components/group/GroupInfo';
import ManageMembers from '@/components/members/ManageMembers';
import TxHistory from '@/components/txHistory/TxHistory';

export default function Group() {
  return (
    <TabGroup>
      <TabList>
        <Tab className='outline-none w-1/2 font-bold bg-secondary text-white data-[selected]:bg-transparent data-[selected]:text-accent data-[hover]:bg-accent data-[hover]:text-white p-4'>
          Group info
        </Tab>
        <Tab className='outline-none w-1/2 font-bold bg-secondary text-white data-[selected]:bg-transparent data-[selected]:text-accent data-[hover]:bg-accent data-[hover]:text-white p-4'>
          Members
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <GroupInfo />
          <TxHistory />
        </TabPanel>
        <TabPanel>
          <ManageMembers />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
