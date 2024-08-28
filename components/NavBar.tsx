'use client';

import ConnectButton from '@/components/ConnectButton';
import { HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className='w-full flex justify-between items-center text-white'>
      <Link href='/' className='bg-secondary rounded-full p-2 inline-block'>
        <HomeIcon className='h-5 w-5' />
      </Link>
      <ConnectButton />
    </div>
  );
}
