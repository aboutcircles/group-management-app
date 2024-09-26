import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo from '@/components/group/GroupInfo';
import ManageMembers from '@/components/members/ManageMembers';
import TxHistory from '@/components/txHistory/TxHistory';

export default function Group() {
  return (
    <TabGroup className='h-[500px]'>
      <TabList className='flex justify-stretch h-[10%]'>
        <Tab className='outline-none w-1/3 font-bold bg-secondary text-white data-[selected]:bg-transparent data-[selected]:text-accent data-[hover]:bg-accent data-[hover]:text-white p-2 break-words transition duration-300 ease-in-out'>
          Group info
        </Tab>
        <Tab className='outline-none w-1/3 font-bold bg-secondary/95 text-white data-[selected]:bg-transparent data-[selected]:text-accent data-[hover]:bg-accent data-[hover]:text-white p-2 break-all transition duration-300 ease-in-out'>
          Members
        </Tab>
        <Tab className='outline-none w-1/3 font-bold bg-secondary/90 text-white data-[selected]:bg-transparent data-[selected]:text-accent data-[hover]:bg-accent data-[hover]:text-white p-2 break-all transition duration-300 ease-in-out'>
          Transactions
        </Tab>
      </TabList>
      <TabPanels className='h-[90%]'>
        <TabPanel className='h-full'>
          <GroupInfo />
        </TabPanel>
        <TabPanel className='h-full'>
          <ManageMembers />
        </TabPanel>
        <TabPanel className='h-full'>
          <TxHistory />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
