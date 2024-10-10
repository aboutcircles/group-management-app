import { useEventsStore } from '@/stores/eventsStore';
import { useGroupStore } from '@/stores/groupStore';
import { formatEvents } from '@/utils/formatEvents';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Address } from 'viem';
import EventType from '@/components/txHistory/EventType';
import Loading from '@/components/layout/Loading';
import { Pagination } from '@nextui-org/react';
import Button from '../common/Button';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { truncateAddress } from '@/utils/truncateAddress';

export default function TxHistory() {
  const events = useEventsStore((state) => state.events);
  const isFetched = useEventsStore((state) => state.isFetched);
  const fetchEvents = useEventsStore((state) => state.fetchEvents);
  const groupInfo = useGroupStore((state) => state.groupInfo);

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  const handleExportCSV = () => {};

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

  if (!isFetched) return <Loading />;

  const totalPages = Math.ceil((filteredEvents?.length || 0) / eventsPerPage);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex w-full justify-end'>
        <Button
          type='button'
          handleClick={handleExportCSV}
          icon={<ArrowUpTrayIcon className='w-5 h-5' />}
        >
          Export transaction history
        </Button>
      </div>
      <div className='flex flex-col gap-y-4 w-full h-5/6'>
        {formattedEvents.map((groupedEvents) => (
          <React.Fragment key={groupedEvents[0].date}>
            <div className='w-full text-gray-400 font-bold'>
              {groupedEvents[0].date}
            </div>
            <div className='flex flex-col w-full divide-y divide-gray/20'>
              {groupedEvents.map((event, index) => (
                <Link
                  href={`https://gnosis.blockscout.com/tx/${event.transactionHash}`}
                  key={index}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center w-full h-[73px] hover:bg-black/5 px-3'
                >
                  <div className='text-gray-500 font-medium text-sm w-1/6'>
                    {event.time}
                  </div>
                  <div className='font-semibold w-4/6'>
                    {truncateAddress(event.eventInfo.data)}
                  </div>
                  <div className='w-1/6'>
                    <EventType type={event.eventInfo.type} />
                  </div>
                </Link>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className='flex justify-end items-center px-2 h-1/6'>
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
      </div>
    </div>
  );
}
