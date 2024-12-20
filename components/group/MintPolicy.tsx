import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { HiCheck } from 'react-icons/hi';
import { Dispatch, SetStateAction } from 'react';
import { type MintPolicy } from '@/types';
import { mintPolicies } from '@/const';

interface MintPolicyProps {
  mintPolicy: MintPolicy;
  setMintPolicy: Dispatch<SetStateAction<MintPolicy>>;
}

export default function MintPolicy({
  mintPolicy,
  setMintPolicy,
}: MintPolicyProps) {
  return (
    <Listbox value={mintPolicy} onChange={setMintPolicy}>
      <ListboxButton className='relative block rounded-lg bg-black/5 py-1.5 pr-8 pl-3 mt-1 text-left text-[11px] md:text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25 overflow-x-clip shadow-sm'>
        <p className='overflow-x-clip'>{mintPolicy.name}</p>
        <ChevronDownIcon
          className='group pointer-events-none absolute top-1.5 right-1.5 md:top-2.5 md:right-2.5 size-4'
          aria-hidden='true'
        />
      </ListboxButton>
      <ListboxOptions
        anchor='bottom'
        transition
        className='w-[var(--button-width)] rounded-xl border border-black/5 bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 mt-1'
      >
        {mintPolicies.map((policy) => (
          <ListboxOption
            key={policy.address}
            value={policy}
            className='group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10 overflow-x-clip'
          >
            <HiCheck className='invisible size-4 fill-black group-data-[selected]:visible' />
            <div className='w-full text-[11px] text-sm/6 text-black overflow-x-clip'>
              {policy.name}
            </div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
