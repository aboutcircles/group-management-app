'use client';

import ConnectButton from '@/components/layout/ConnectButton';
import { HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className='w-full flex justify-between items-center text-white'>
      <Link
        href='/'
        className='bg-secondary rounded-full p-1.5 inline-block border-2 border-transparent hover:border-white transition duration-300 ease-in-out'
      >
        <HomeIcon className='h-5 w-5' />
      </Link>
      <ConnectButton />
    </div>
  );
}
