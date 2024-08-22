'use client';

import ConnectButton from '@/components/ConnectButton';
import DropDown from '@/components/DropDown';
import Fallback from '@/components/Fallback';
import RegisterGroup from '@/components/RegisterGroup';
import { useAutoConnect } from '@/hooks/useAutoConnect';
import { HomeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount } from 'wagmi';

export default function Page() {
  const { address } = useAccount();
  useAutoConnect();

  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <div className='w-full lg:w-[775px] lg:my-4 bg-primary md:h-full lg:h-auto shadow-md p-4 lg:rounded-3xl flex gap-y-4 flex-col justify-start items-center'>
        <div className='w-full flex justify-between items-center'>
          <button className='bg-secondary rounded-full p-2'>
            <HomeIcon className='h-5 w-5' />
          </button>
          <ConnectButton address={address} />
        </div>
        <div className='w-full relative h-full  bg-background text-black rounded-2xl p-4'>
          {/* TODO: if safe connected and group registered -> dashboard
                    else if safe connected and no group registered -> group registration
                    else -> fallback */}
          {address ? <RegisterGroup /> : <Fallback />}
        </div>
        <div className='w-full flex flex-col-reverse sm:flex-row justify-between'>
          <div className='flex flex-col items-center  mt-4 sm:mt-0'>
            <Image
              src='/circles.svg'
              alt='Circles Logo'
              width={105}
              height={105}
            />
            <p className='text-[6px] leading-[6px] sm:text-[8px] sm:leading-[8px] mt-2 '>
              CIRCLES GROUP MANAGEMENT
            </p>
          </div>
          <div className='flex flex-1'>
            <Link
              target='_blank'
              className='flex flex-1 justify-center text-sm text-centerlg:text-base items-center underline hover:text-white/80'
              href={'https://www.aboutcircles.com/'}
            >
              Learn more about
              <br className='sm:hidden' /> the Circles Project
            </Link>
            <div className='flex justify-center items-center'>
              <DropDown />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
