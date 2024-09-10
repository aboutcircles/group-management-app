'use client';

import DropDown from '@/components/layout/DropDown';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className='w-full flex flex-col-reverse sm:flex-row justify-between text-white'>
      <div className='flex flex-col items-center  mt-4 sm:mt-0'>
        <Image src='/circles.svg' alt='Circles Logo' width={105} height={105} />
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
  );
}
