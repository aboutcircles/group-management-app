import { create } from 'zustand';
import { useGroupStore } from '@/stores/groupStore';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address } from 'viem';
import { CirclesEvent } from '@circles-sdk/data';

type EventsStore = {
  events?: CirclesEvent[];
  fetchEvents: () => Promise<void>;
  isFetched: boolean;
  lastEvent?: CirclesEvent;
  subscribeToEvents: () => Promise<void>;
};

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],
  isFetched: false,
  lastEvent: undefined,

  fetchEvents: async () => {
    const groupInfo = useGroupStore.getState().groupInfo;
    const circlesData = useCirclesSdkStore.getState().circlesData;
    // console.log('fetchEvents', groupInfo, circlesData);

    try {
      const events = await circlesData?.getEvents(
        groupInfo?.group.toLowerCase() as Address,
        groupInfo?.blockNumber as number
      );
      // set({ events: events?.reverse() || [], isFetched: true });
      set({ events: events || [], isFetched: true });
    } catch (error) {
      console.error('Failed to get events:', error);
    }
  },

  subscribeToEvents: async () => {
    const circlesData = useCirclesSdkStore.getState().circlesData;
    const groupInfo = useGroupStore.getState().groupInfo;
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
      });
    } catch (error) {
      console.error('Failed to subscribe to events:', error);
    }
  },
}));
