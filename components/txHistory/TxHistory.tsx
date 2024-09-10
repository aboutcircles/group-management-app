import { truncateAddress } from '@/utils/truncateAddress';
import { CirclesEvent } from '@circles-sdk/data';

export default function TxHistory({ events }: { events: CirclesEvent[] }) {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!txHistoryQuery || txHistoryQuery === undefined) return;
  //     console.log('fetching data');
  //     const hasData = await txHistoryQuery.queryNextPage();
  //     console.log('hasData', hasData);
  //     if (hasData) {
  //       console.log(txHistoryQuery.currentPage?.results);
  //     }
  //   };
  //   fetchData();
  // }, [txHistoryQuery]);

  return (
    <div>
      <h1>Transaction History</h1>
      {events.map((event) => (
        <div key={event.transactionHash + event.$event} className='flex gap-1'>
          <p>{event.$event}</p>
          <p>{new Date((event.timestamp as number) * 1000).toLocaleString()}</p>
          <p>{truncateAddress(event.transactionHash as string)}</p>
        </div>
      ))}
    </div>
  );
}
