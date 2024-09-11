import { useEventsStore } from '@/stores/eventsStore';
import { useGroupStore } from '@/stores/groupStore';
import { formatEvents } from '@/utils/formatEvents';
import { truncateAddress } from '@/utils/truncateAddress';
import React from 'react';
import { useEffect } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

export default function TxHistory() {
  const { address } = useAccount();
  const events = useEventsStore((state) => state.events);
  const isFetched = useEventsStore((state) => state.isFetched);
  const fetchEvents = useEventsStore((state) => state.fetchEvents);
  const groupInfo = useGroupStore((state) => state.groupInfo);

  useEffect(() => {
    if (!isFetched) {
      fetchEvents();
    }
  }, [fetchEvents, isFetched]);

  const formattedEvents = formatEvents(
    events || [],
    groupInfo?.group as Address,
    groupInfo?.symbol as string
  );

  console.log('events', formattedEvents);

  return (
    <div className='mt-8'>
      <h1 className='text-2xl font-bold text-center text-accent'>
        Transaction History
      </h1>
      <div className='grid grid-cols-5 gap-1 items-center'>
        {formattedEvents.map((groupedEvents) => (
          <React.Fragment key={groupedEvents[0].date}>
            <div className='col-span-5 mt-3 mx-4 text-accent font-bold'>
              {groupedEvents[0].date}
            </div>
            {groupedEvents.map((event) => (
              <a
                href={`https://gnosis.blockscout.com/tx/${event.transactionHash}`}
                key={event.transactionHash + event.$event}
                target='_blank'
                rel='noopener noreferrer'
                // className='contents'
                className='grid grid-cols-subgrid gap-1 col-span-5 hover:bg-accent/20'
              >
                <div className='py-1 text-gray mx-2'>{event.time}</div>
                <div className='col-span-3 py-1'>{event.eventInfo.a}</div>
                <div className='py-1'>{event.eventInfo.b}</div>
              </a>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
