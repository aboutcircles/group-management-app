import { create } from 'zustand';
import { useGroupStore } from '@/stores/groupStore';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address } from 'viem';
import { CirclesEvent } from '@circles-sdk/data';
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
      const events = await circlesData?.getEvents(
        groupInfo?.group.toLowerCase() as Address,
        groupInfo?.blockNumber as number
      );

      console.log('events', events);
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
        if (
          event.$event === 'CrcV2_CollateralLockedSingle' ||
          event.$event === 'CrcV2_CollateralLockedBatch'
        ) {
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
