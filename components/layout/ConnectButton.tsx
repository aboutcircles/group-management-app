import { truncateAddress } from '@/utils/truncateAddress';
import { useAccount } from 'wagmi';

export default function ConnectButton() {
  const { address } = useAccount();

  const handleClick = () => {
    if (address) return;
    window.open('https://app.safe.global/');
  };

  return (
    <button
      onClick={handleClick}
      className='bg-secondary rounded-full text-sm px-2 py-1 border-2 border-transparent hover:border-white transition duration-300 ease-in-out'
    >
      {address ? truncateAddress(address) : 'Open via Safe App'}
    </button>
  );
}
