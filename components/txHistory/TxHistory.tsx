import { useEventsStore } from '@/stores/eventsStore';
import { useGroupStore } from '@/stores/groupStore';
import { formatEvents } from '@/utils/formatEvents';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Address } from 'viem';
import EventType from '@/components/txHistory/EventType';
import Loading from '@/components/layout/Loading';
import { Pagination } from '@nextui-org/react';

export default function TxHistory() {
  const events = useEventsStore((state) => state.events);
  const isFetched = useEventsStore((state) => state.isFetched);
  const fetchEvents = useEventsStore((state) => state.fetchEvents);
  const groupInfo = useGroupStore((state) => state.groupInfo);

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  useEffect(() => {
    if (!isFetched) {
      fetchEvents();
    }
  }, [fetchEvents, isFetched]);

  const filteredEvents = (events || []).filter(
    (event) => event !== undefined && event !== null
  );

  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  const formattedEvents = formatEvents(
    paginatedEvents,
    groupInfo?.group as Address,
    groupInfo?.symbol as string
  );

  // console.log('events', formattedEvents);

  if (!isFetched) return <Loading />;

  const totalPages = Math.ceil((filteredEvents?.length || 0) / eventsPerPage);

  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='flex w-full p-2 font-bold'>Transaction history:</div>
      <div className='flex flex-col w-full'>
        <div className='grid grid-cols-8 gap-0 items-center overflow-y-auto h-5/6'>
          {formattedEvents.map((groupedEvents) => (
            <React.Fragment key={groupedEvents[0].date}>
              <div className='col-span-8 mt-5 mb-2 mx-4 text-accent font-bold'>
                {groupedEvents[0].date}
              </div>
              {groupedEvents.map((event, index) => (
                <a
                  href={`https://gnosis.blockscout.com/tx/${event.transactionHash}`}
                  key={index}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='grid grid-cols-subgrid grid-rows-3 sm:grid-rows-1 gap-0 col-span-8 hover:bg-accent/20 border-b border-gray/20 py-3'
                >
                  <div className='text-gray mx-2 col-span-2 sm:col-span-1 row-span-3 sm:row-span-1 text-sm py-0.5 sm:py-0'>
                    {event.time}
                  </div>
                  <div className='col-span-6 px-1 sm:col-span-5 order-last sm:order-none break-all row-span-2 sm:row-span-1'>
                    {event.eventInfo.data}
                  </div>
                  <div className='col-span-6 px-1 sm:col-span-2'>
                    <EventType type={event.eventInfo.type} />
                  </div>
                </a>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* <div className='flex justify-end items-center px-2 h-1/6'>
          <Pagination
            isCompact
            showControls
            showShadow
            size='sm'
            color='primary'
            page={currentPage}
            total={totalPages}
            onChange={(page_) => setCurrentPage(page_)}
          />
        </div> */}
      </div>
    </div>
  );
}
