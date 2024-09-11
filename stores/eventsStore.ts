import { create } from 'zustand';
import { useGroupStore } from '@/stores/groupStore';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import { Address } from 'viem';
import { CirclesEvent } from '@circles-sdk/data';

type EventsStore = {
  events?: CirclesEvent[];
  fetchEvents: () => Promise<void>;
  isFetched: boolean;
};

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],
  isFetched: false,

  fetchEvents: async () => {
    console.log('fetchEvents');
    const groupInfo = useGroupStore.getState().groupInfo;
    const circlesData = useCirclesSdkStore.getState().circlesData;

    try {
      const events = await circlesData?.getEvents(
        groupInfo?.group.toLowerCase() as Address,
        groupInfo?.blockNumber as number
      );
      set({ events: events?.reverse() || [], isFetched: true });
    } catch (error) {
      console.error('Failed to get events:', error);
    }
  },
}));
