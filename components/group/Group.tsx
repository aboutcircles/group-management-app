import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import GroupInfo from '@/components/group/GroupInfo';
import useCircles from '@/hooks/useCircles';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ManageMembers from '@/components/members/ManageMembers';
import { circlesEventTypes, ProfileWithAddress } from '@/types';
import { Address } from 'viem';
import {
  CirclesEvent,
  CirclesQuery,
  TransactionHistoryRow,
} from '@circles-sdk/data';
import TxHistory from '@/components/txHistory/TxHistory';

export default function Group() {
  // const [txHistoryQuery, setTxHistoryQuery] =
  //   useState<CirclesQuery<TransactionHistoryRow> | null>(null);

  // const [events, setEvents] = useState<CirclesEvent[] | null>(null);

  // useEffect(() => {
  //   const fetchTxHistory = async () => {
  //     if (!group) return;
  //     const txHistoryQuery = await getTransactionHistory();
  //     setTxHistoryQuery(txHistoryQuery);
  //     if (!txHistoryQuery) return;
  //     const hasData = await txHistoryQuery.queryNextPage();
  //     console.log('hasData', hasData);
  //     if (hasData) {
  //       console.log(txHistoryQuery.currentPage?.results);
  //     }
  //   };
  //   fetchTxHistory();
  // }, [group, getTransactionHistory]);

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     if (!group || !circles) return;
  //     const _events = await getEvents(0);
  //     const filteredEvents = (_events as CirclesEvent[])
  //       .filter((event) => circlesEventTypes.includes(event.$event))
  //       .reverse();
  //     setEvents(filteredEvents);
  //   };
  //   fetchEvents();
  // }, [group, circles, getEvents]);

  // if (!group || !circles || !groupInfoIsFetched) return <div>Loading...</div>;

  // console.log('events', events);

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
          {/* <TxHistory /> */}
        </TabPanel>
        <TabPanel>
          <ManageMembers />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
