"use client";
import Fallback from "@/components/Fallback";
import RegisterGroup from "@/components/RegisterGroup";
import { useAccount } from "wagmi";
import { useSafeProvider } from "@/hooks/useSafeProvider";
import { useEffect } from 'react';

export default function Page() {
  const { address } = useAccount();
  const provider  = useSafeProvider();

  useEffect(() => {
    if (provider) {
      console.log('Got SafeAppProvider:', provider);
    } else {
      console.log('Provider is not yet available.');
    }
  }, [provider]);
  
  return <>{address ? <RegisterGroup /> : <Fallback />}</>;
}
