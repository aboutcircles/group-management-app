import { useEventsStore } from '@/stores/eventsStore';
import { useGroupStore } from '@/stores/groupStore';
import { formatEvents } from '@/utils/formatEvents';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Address } from 'viem';
import EventType from '@/components/txHistory/EventType';
import Loading from '@/components/layout/Loading';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { truncateAddress } from '@/utils/truncateAddress';
import { Button } from '@/components/common/Button';
import Papa from 'papaparse';
import { Pagination } from '@/components/common/Pagination';

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

  const handleExportCSV = () => {
    if (!filteredEvents || filteredEvents.length === 0) {
      return;
    }

    const csv = Papa.unparse(filteredEvents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'txHistory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className='w-full h-full flex flex-col items-center'>
      <div className='flex w-full justify-end my-3 sm:my-5'>
        <Button
          type='button'
          handleClick={handleExportCSV}
          icon={<ArrowUpTrayIcon className='w-5 h-5' />}
        >
          Export transaction history
        </Button>
      </div>
      <div className='flex flex-col gap-y-4 w-full flex-1'>
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
                  className='flex items-center w-full hover:bg-black/5 px-3 py-5'
                >
                  <div className='text-gray-500 font-medium text-sm w-2/12'>
                    {event.time}
                  </div>
                  <div className='font-semibold w-7/12'>
                    {event.eventInfo.type === 'mint'
                      ? event.eventInfo.data
                      : truncateAddress(event.eventInfo.data)}
                  </div>
                  <div className='w-3/12'>
                    <EventType type={event.eventInfo.type} />
                  </div>
                </Link>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      {formattedEvents.length > 0 && (
        <div className='w-full flex items-center justify-center pt-5'>
          <Pagination
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}
