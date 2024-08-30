"use client";
import Fallback from "@/components/Fallback";
import RegisterGroup from "@/components/RegisterGroup";
import { useAccount } from "wagmi";

export default function Page() {
  const { address } = useAccount();
  return <>{address ? <RegisterGroup /> : <Fallback />}</>;
}
