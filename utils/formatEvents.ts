import { FormattedEvent } from '@/types';
import { CirclesEvent } from '@circles-sdk/data';
import { Address, formatEther } from 'viem';
import { getTrustType } from '@/utils/getTrustType';

export const formatEvents = (
  events: any[],
  groupAddress: Address,
  symbol: string
) => {
  const formattedEvents = events.reduce((acc, event) => {
    if (
      event.$event !== 'CrcV2_GroupMintSingle' &&
      event.$event !== 'CrcV2_Trust'
    ) {
      return acc;
    }

    const eventInfo = {} as any;
    if (event.$event === 'CrcV2_GroupMintSingle') {
      eventInfo.a = 'Group token minted';
      eventInfo.b = `+${formatEther(event.value)} ${symbol}`;
    }
    if (event.$event === 'CrcV2_Trust') {
      eventInfo.a =
        event.trustee === groupAddress.toLowerCase()
          ? event.truster
          : event.trustee;
      eventInfo.b = getTrustType(event, groupAddress);
    }

    const dateObj = new Date((event.timestamp as number) * 1000);
    const formattedEvent = {
      ...event,
      date: dateObj.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      eventInfo,
    };

    const dateKey = formattedEvent.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(formattedEvent);
    return acc;
  }, {} as Record<string, FormattedEvent[]>);

  const groupedEvents = Object.values(formattedEvents);
  return groupedEvents as FormattedEvent[][];
};
