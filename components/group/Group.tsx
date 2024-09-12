import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo from '@/components/group/GroupInfo';
import ManageMembers from '@/components/members/ManageMembers';
import TxHistory from '@/components/txHistory/TxHistory';

export default function Group() {
  return (
    <TabGroup>
      <TabList>
        <Tab className='outline-none w-1/3 font-bold bg-secondary text-white data-[selected]:bg-transparent data-[selected]:text-accent data-[hover]:bg-accent data-[hover]:text-white p-4'>
          Group info
        </Tab>
        <Tab className='outline-none w-1/3 font-bold bg-secondary/95 text-white data-[selected]:bg-transparent data-[selected]:text-accent data-[hover]:bg-accent data-[hover]:text-white p-4'>
          Members
        </Tab>
        <Tab className='outline-none w-1/3 font-bold bg-secondary/90 text-white data-[selected]:bg-transparent data-[selected]:text-accent data-[hover]:bg-accent data-[hover]:text-white p-4'>
          Transactions
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <GroupInfo />
        </TabPanel>
        <TabPanel>
          <ManageMembers />
        </TabPanel>
        <TabPanel>
          <TxHistory />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
