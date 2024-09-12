"use client";

import { useEffect } from "react";
import { useEventsStore } from "@/stores/eventsStore";
import { useCirclesSdkStore } from "@/stores/circlesSdkStore";
import { useGroupStore } from "@/stores/groupStore";
import { toast } from "react-toastify";
import TransactionToast from "./TransactionToast";

const EventToastNotifier = () => {
  const lastEvent = useEventsStore((state) => state.lastEvent);
  const subscribeToEvents = useEventsStore((state) => state.subscribeToEvents);
  
  const groupInfo = useGroupStore((state) => state.groupInfo);
  const circlesData = useCirclesSdkStore((state) => state.circlesData);

  useEffect(() => {
    if (groupInfo && circlesData) {
      subscribeToEvents();
    } else {
      console.log('groupInfo or circlesData not available yet');
    }
  }, [subscribeToEvents, groupInfo, circlesData]);

  useEffect(() => {
    console.log("last event changed", lastEvent);
    if (lastEvent) {
      // toast(<TransactionToast transactionHash={lastEvent.transactionHash} />);
    }
  }, [lastEvent]);

  return null;
};

export default EventToastNotifier;
