import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo from '@/components/GroupInfo';
import useCircles from '@/hooks/useCircles';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ManageMembers from '@/components/ManageMembers';
import { ProfileWithAddress } from '@/types';
import { Address } from 'viem';

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
      console.log('trustRelations', trustRelations);

      const trustAddresses: Address[] = [];
      const relations: Record<string, string> = {};

      trustRelations.forEach((item) => {
        trustAddresses.push(item.objectAvatar as Address);
        relations[item.objectAvatar] = item.relation;
      });

      const avatarProfiles = await getAvatarsProfilesByAddresses(
        trustAddresses as Address[]
      );

      const avatarProfilesWithRelations = avatarProfiles.map((profile) => {
        return {
          ...profile,
          relation: relations[profile.address],
        };
      });

      setMembers(avatarProfilesWithRelations);
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

  console.log('members', members);

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
