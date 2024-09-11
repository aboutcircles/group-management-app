import { useEventsStore } from '@/stores/eventsStore';
import { truncateAddress } from '@/utils/truncateAddress';
import { useEffect } from 'react';

export default function TxHistory() {
  const events = useEventsStore((state) => state.events);
  const isFetched = useEventsStore((state) => state.isFetched);
  const fetchEvents = useEventsStore((state) => state.fetchEvents);

  useEffect(() => {
    if (!isFetched) {
      fetchEvents();
    }
  }, [fetchEvents, isFetched]);

  return (
    <div>
      <h1>Transaction History</h1>
      {events?.map((event) => (
        <div key={event.transactionHash + event.$event} className='flex gap-1'>
          <p>{event.$event}</p>
          <p>{new Date((event.timestamp as number) * 1000).toLocaleString()}</p>
          <p>{truncateAddress(event.transactionHash as string)}</p>
        </div>
      ))}
    </div>
  );
}
