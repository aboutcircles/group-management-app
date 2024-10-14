import {
  ArrowRightIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { HiCheck, HiOutlineX } from 'react-icons/hi';
import CreateGroupForm from '@/components/group/CreateGroupForm';
import Link from 'next/link';
import { Step } from '@/types';
import { useState } from 'react';
import { Button } from 'flowbite-react';

export default function RegisterGroup({}: {}) {
  const [step, setStep] = useState<Step>('start');

  return (
    <div className='w-full flex-1 flex flex-col items-center justify-center gap-y-8 md:gap-y-4 rounded-xl px-2 sm:px-10 border py-10 sm:py-20'>
      {step === 'start' ? (
        <>
          <p className='text-2xl md:text-3xl text-center font-bold text-primary pt-10'>
            Welcome to Circles Group Management
          </p>
          <p className='text-gray-900 text-center'>
            Create a group for you and your community
          </p>
          <Button
            type='button'
            className='flex items-center justify-center font-medium bg-accent mb-20'
            onClick={() => setStep('form')}
          >
            <span className='mr-2'>
              <ArrowRightIcon className='h-5 w-5' />
            </span>
            Get Started
          </Button>
        </>
      ) : step === 'form' ? (
        <CreateGroupForm setStep={setStep} />
      ) : step === 'executed' ? (
        <div className='w-full flex flex-col items-center'>
          <div className='flex items-center'>
            <HiCheck className='h-5 w-5' /> Your group was sucessfully created !
          </div>
          <Link
            className='text-accent flex items-center px-4 py-1 rounded-full mt-4 text-base font-semibold'
            href={'/group'}
          >
            View group
          </Link>
        </div>
      ) : step === 'error' ? (
        <div className='text-gray-900 w-full flex flex-col items-center'>
          <div className='flex items-center'>
            <HiOutlineX className='h-5 w-5' /> Something went wrong with your
            transaction, try again or contact the support
            <Link
              href='https://www.aboutcircles.com/community'
              target='_blank'
              className='text-accent underline ml-1'
            >
              here
            </Link>
            .
          </div>
          <button
            className='text-[#DD7143] flex items-center px-4 py-1 rounded-full mt-4 text-base font-semibold'
            onClick={() => setStep('start')}
          >
            Back <ArrowUturnLeftIcon className='h-4 w-4 ml-2' />
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
