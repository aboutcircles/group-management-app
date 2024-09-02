import { ArrowRightIcon, ArrowUturnLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Description, Field, Input, Label } from '@headlessui/react';
import CreateGroupForm from './CreateGroupForm';
import Link from 'next/link';

type Step = 'start' | 'form' | 'executed';

export default function RegisterGroup() {
  const [step, setStep] = useState<Step>('start');

  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-y-8 md:gap-y-4 p-4 md:p-8'>
      {step === 'start' ? (
        <>
          <p className='text-2xl text-center font-bold'>
            Welcome to Circles Group Management
          </p>
          <p className='text-sm'>Create a group for you and your community</p>
          <button
            className="flex items-center bg-gradient-to-r from-accent/90 to-accent/80 rounded-full text-lg px-3 py-1 hover:bg-accent/90 text-white shadow-md hover:shadow-lg transition duration-300 ease-in-out mt-4"
            onClick={() => setStep('form')}
          >
            Get Started
            <ArrowRightIcon className='h-4 w-4 ml-1' />
          </button>
        </>
      ) : step === 'form' ? (
        <CreateGroupForm setStep={setStep} />
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5" /> Your transaction is completed !
            View it
            <Link
              href={"https://gnosis.blockscout.com/tx/" + "tx"}
              target="_blank"
              className="text-accent underline ml-1"
            >
              here
            </Link>
            .
          </div>
          <button
            className="text-[#DD7143] flex items-center px-4 py-1 rounded-full mt-4 text-base font-semibold"
            onClick={() => setStep("start")}
          >
            Back <ArrowUturnLeftIcon className="h-4 w-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}
