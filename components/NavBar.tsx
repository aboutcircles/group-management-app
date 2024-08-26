'use client';

import ConnectButton from '@/components/ConnectButton';
// import { useAutoConnect } from '@/hooks/useAutoConnect';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { useSafe } from '@/hooks/useSafe';

export default function Navbar() {
  const { address } = useAccount();
  // const { safeAddress: address } = useSafe();
  // useAutoConnect();
  const router = useRouter();

  return (
    <div className='w-full flex justify-between items-center text-white'>
      <Link href='/' className='bg-secondary rounded-full p-2 inline-block'>
        <HomeIcon className='h-5 w-5' />
      </Link>
      <ConnectButton address={address as `0x${string}`} />
    </div>
  );
}
