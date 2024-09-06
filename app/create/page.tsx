"use client";
import Fallback from "@/components/Fallback";
import RegisterGroup from "@/components/RegisterGroup";
import { useAccount } from "wagmi";
import { useSafeProvider } from "@/hooks/useSafeProvider";
import { useEffect } from "react";
import useCircles from "@/hooks/useCircles";
import { useRouter } from "next/navigation";

export default function Page() {
  const { address } = useAccount();
  // const provider = useSafeProvider();
  const router = useRouter();
  const { groupAvatar, subscribeToAvatarEvents } = useCircles();

  useEffect(() => {
    const unsubscribe = subscribeToAvatarEvents();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [subscribeToAvatarEvents]);

  // TODO: push to group only if RegisterGroup step is equal to start
  // useEffect(() => {
  //   if (groupAvatar) {
  //     router.push("/group");
  //   }
  // }, [router, groupAvatar]);

  // useEffect(() => {
  //   if (provider) {
  //     console.log('Got SafeAppProvider:', provider);
  //   } else {
  //     console.log('Provider is not yet available.');
  //   }
  // }, [provider]);

  return <>{address ? <RegisterGroup /> : <Fallback />}</>;
}
