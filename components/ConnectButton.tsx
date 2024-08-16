import { truncateAddress } from "@/utils/truncateAddress";

interface ConnectButtonProps {
  address: `0x${string}` | undefined;
}

export default function ConnectButton({ address }: ConnectButtonProps) {
  return (
    <button className="bg-accent rounded-full px-2 py-1 border-2 border-transparent hover:border-white transition duration-300 ease-in-ou">
      {address ? truncateAddress(address) : "Connect Wallet"}
    </button>
  );
}
