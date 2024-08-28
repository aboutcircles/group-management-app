import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo, { Group as GroupType } from './GroupInfo';
import useCircles from '@/hooks/useCircles';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ManageMembers from './ManageMembers';

export default function Group() {
  const { address } = useAccount();
  const { findGroupByAddress, circles } = useCircles();
  const [group, setGroup] = useState<GroupType | undefined>(undefined);

  console.log('circles from Group', circles);

  useEffect(() => {
    console.log('use effect for Group', circles);
    const fetchGroup = async () => {
      if (!address || !circles) return;
      console.log('address', address.toLowerCase());
      const group = await findGroupByAddress(
        // '0x3487e4ae480bc5e461a7bcfd5de81513335193e7' // works
        '0xec549ed5ab5c05ffcde00e77115bcb0728f36070'
        // address.toLowerCase() // not working
        // address // also not
      );
      console.log('groups', group);
      setGroup(group as GroupType);
    };
    fetchGroup();
  }, [address, circles, findGroupByAddress]);

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
        <TabPanel>
          <ManageMembers />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
