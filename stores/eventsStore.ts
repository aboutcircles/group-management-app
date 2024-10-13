import { create } from 'zustand';
import { useGroupStore } from '@/stores/groupStore';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address } from 'viem';
import { CirclesEvent } from '@circles-sdk/data';
import { parseRpcSubscriptionMessage } from './eventParser-temporary';
import { useMembersStore } from '@/stores/membersStore';

type EventsStore = {
  events?: any[];
  fetchEvents: () => Promise<void>;
  isFetched: boolean;
  lastEvent?: any;
  subscribeToEvents: () => Promise<void>;
};

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],
  isFetched: false,
  lastEvent: undefined,

  fetchEvents: async () => {
    const groupInfo = useGroupStore.getState().groupInfo;
    const circlesData = useCirclesSdkStore.getState().circlesData;

    try {
      // TODO: temporary solution
      const postData = {
        jsonrpc: '2.0',
        id: 2,
        method: 'circles_events',
        params: [
          groupInfo?.group.toLowerCase(),
          groupInfo?.blockNumber,
          null,
          null,
          null,
          null,
        ],
      };

      const response = await fetch(
        'https://rpc.falkenstein.aboutcircles.com/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();
      const events = parseRpcSubscriptionMessage(responseJson.result);

      // const events = await circlesData?.getEvents(
      //   groupInfo?.group.toLowerCase() as Address,
      //   groupInfo?.blockNumber as number
      // );
      set({ events: events || [], isFetched: true });
    } catch (error) {
      console.error('Failed to get events:', error);
    }
  },

  subscribeToEvents: async () => {
    const circlesData = useCirclesSdkStore.getState().circlesData;
    const groupInfo = useGroupStore.getState().groupInfo;
    const fetchTotalSupply = useGroupStore.getState().fetchTotalSupply;
    const fetchMembers = useMembersStore.getState().fetchMembers;
    // console.log('subscribeToEvents', groupInfo, circlesData);

    try {
      const eventSubscription = await circlesData?.subscribeToEvents(
        groupInfo?.group.toLowerCase() as Address
      );
      // console.log(eventSubscription);

      eventSubscription?.subscribe((event: CirclesEvent) => {
        // console.log('Event received:', event);
        set((state) => ({
          events: [event, ...(state.events || [])],
          lastEvent: event,
        }));
        // @ts-ignore
        if (event.$event === 'CrcV2_GroupMintSingle') {
          fetchTotalSupply();
        }
        if (event.$event === 'CrcV2_Trust') {
          fetchMembers();
        }
      });
    } catch (error) {
      console.error('Failed to subscribe to events:', error);
    }
  },
}));
