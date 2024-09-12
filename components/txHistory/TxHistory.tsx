import { useEventsStore } from '@/stores/eventsStore';
import { useGroupStore } from '@/stores/groupStore';
import { formatEvents } from '@/utils/formatEvents';
import React from 'react';
import { useEffect } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import EventType from '@/components/txHistory/EventType';

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
      <div className='grid grid-cols-8 gap-0 items-center'>
        {formattedEvents.map((groupedEvents) => (
          <React.Fragment key={groupedEvents[0].date}>
            <div className='col-span-8 mt-5 mb-2 mx-4 text-accent font-bold'>
              {groupedEvents[0].date}
            </div>
            {groupedEvents.map((event) => (
              <a
                href={`https://gnosis.blockscout.com/tx/${event.transactionHash}`}
                key={event.transactionHash + event.$event}
                target='_blank'
                rel='noopener noreferrer'
                // className='contents'
                className='grid grid-cols-subgrid grid-rows-3 sm:grid-rows-1 gap-0 col-span-8 hover:bg-accent/20 border-b border-gray/20 py-3'
              >
                <div className='text-gray mx-2 col-span-2 sm:col-span-1 row-span-3 sm:row-span-1 text-sm py-0.5 sm:py-0'>
                  {event.time}
                </div>
                <div className='col-span-6 px-1 sm:col-span-5 order-last sm:order-none break-all row-span-2 sm:row-span-1'>
                  {event.eventInfo.data}
                </div>
                <div className='col-span-6 px-1 sm:col-span-2'>
                  {/* {event.eventInfo.type} */}
                  <EventType type={event.eventInfo.type} />
                </div>
              </a>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
