import {
  ArrowRightIcon,
  ArrowUturnLeftIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import CreateGroupForm from '@/components/group/CreateGroupForm';
import Link from 'next/link';
import { Step } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export default function RegisterGroup({
  step,
  setStep,
}: {
  step: Step;
  setStep: Dispatch<SetStateAction<Step>>;
}) {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-y-8 md:gap-y-4 p-4 md:p-8'>
      {step === 'start' ? (
        <>
          <p className='text-2xl text-center font-bold'>
            Welcome to Circles Group Management
          </p>
          <p className='text-sm'>Create a group for you and your community</p>
          <button
            className='flex items-center bg-gradient-to-r from-accent/90 to-accent/80 rounded-full text-lg px-3 py-1 hover:bg-accent/90 text-white shadow-md hover:shadow-lg transition duration-300 ease-in-out mt-4'
            onClick={() => setStep('form')}
          >
            Get Started
            <ArrowRightIcon className='h-4 w-4 ml-1' />
          </button>
        </>
      ) : step === 'form' ? (
        <CreateGroupForm setStep={setStep} />
      ) : step === 'executed' ? (
        <div className='w-full flex flex-col items-center'>
          <div className='flex items-center'>
            <CheckIcon className='h-5 w-5' /> Your group was sucessfully created
            !
          </div>
          <Link
            className='text-accent flex items-center px-4 py-1 rounded-full mt-4 text-base font-semibold'
            href={'/group'}
          >
            View group
          </Link>
        </div>
      ) : step === 'error' ? (
        <div className='w-full flex flex-col items-center'>
          <div className='flex items-center'>
            <XMarkIcon className='h-5 w-5' /> Something went wrong with your
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
