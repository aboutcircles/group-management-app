import { useAutoConnect } from "@/hooks/useAutoConnect";
import { useAccount } from "wagmi";

export default function ConnectButton() {
  const { address } = useAccount();
  useAutoConnect();

  return (
    <button className="bg-accent rounded-full px-2 py-1 border-2 border-transparent hover:border-white transition duration-300 ease-in-ou">
      {address ? address : "Connect Wallet"}
    </button>
  );
}
