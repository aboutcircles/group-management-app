import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo from '@/components/GroupInfo';
import useCircles from '@/hooks/useCircles';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ManageMembers from '@/components/ManageMembers';
import { ProfileWithAddress, TrustRelation } from '@/types';

export default function Group() {
  const { address } = useAccount();
  const {
    findGroupByAddress,
    getTrustRelations,
    circles,
    groupInfo: group,
    groupInfoIsFetched,
    fetchAvatarInfos,
    getAvatarsProfilesByAddresses,
  } = useCircles();
  const [members, setMembers] = useState<ProfileWithAddress[]>([]);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!address || !circles) return;
      const trustRelations = await getTrustRelations(address);

      const trustAddresses = trustRelations.map((item) => item.trustee);
      const avatarProfiles = await getAvatarsProfilesByAddresses(
        trustAddresses
      );
      setMembers(avatarProfiles);
      // console.log('avatarProfiles', avatarProfiles);
    };
    fetchGroup();
  }, [
    address,
    circles,
    fetchAvatarInfos,
    findGroupByAddress,
    getAvatarsProfilesByAddresses,
    getTrustRelations,
  ]);

  if (!group || !circles || !groupInfoIsFetched) return <div>Loading...</div>;

  // console.log('trusts', trusts);

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
          <GroupInfo group={group} />
        </TabPanel>
        <TabPanel>
          <ManageMembers members={members} setMembers={setMembers} />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
