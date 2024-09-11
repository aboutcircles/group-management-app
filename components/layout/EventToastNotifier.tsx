"use client";

import { useEffect } from "react";
import { useEventsStore } from "@/stores/eventsStore";
import { toast } from "react-toastify";
import TransactionToast from "./TransactionToast";

const EventToastNotifier = () => {
  const lastEvent = useEventsStore((state) => state.lastEvent);
  const subscribeToEvents = useEventsStore((state) => state.subscribeToEvents);

  useEffect(() => {
    subscribeToEvents();
  }, [subscribeToEvents]);

  useEffect(() => {
    console.log("last event changed", lastEvent);
    if (lastEvent) {
      toast(<TransactionToast transactionHash={lastEvent.transactionHash} />);
    }
  }, [lastEvent]);

  return null;
};

export default EventToastNotifier;
