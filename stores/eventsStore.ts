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
    console.log('fetchEvents');
    const groupInfo = useGroupStore.getState().groupInfo;
    const circlesData = useCirclesSdkStore.getState().circlesData;

    try {
      const events = await circlesData?.getEvents(
        groupInfo?.group.toLowerCase() as Address,
        groupInfo?.blockNumber as number
      );
      set({ events, isFetched: true });
    } catch (error) {
      console.error('Failed to get events:', error);
    }
  },

  subscribeToEvents: async () => {
    console.log('subscribeToEvents');
    const circlesData = useCirclesSdkStore.getState().circlesData;
    const groupInfo = useGroupStore.getState().groupInfo;

    if (!circlesData || !groupInfo?.group) {
      console.error('CirclesData or group information is missing', circlesData, groupInfo);
      return;
    }

    try {
      const eventSubscription = await circlesData.subscribeToEvents(
        groupInfo?.group as Address
      );
      console.log(eventSubscription);

      eventSubscription.subscribe((event: CirclesEvent) => {
        set((state) => ({
          events: [...(state.events || []), event],
          lastEvent: event,
        }));

        console.log('Event received:', event);
      });
    } catch (error) {
      console.error('Failed to subscribe to events:', error);
    }
  },
}));
