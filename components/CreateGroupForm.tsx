import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useState } from 'react';
import { Description, Field, Input, Label, Textarea } from '@headlessui/react';
import { isValidName, isValidSymbol } from '@/utils/isValid';
import MintPolicy, { mintPolicies } from './MintPolicy';
import useCircles from '@/hooks/useCirclesSdk';
import { Avatar, CirclesConfig, Sdk } from '@circles-sdk/sdk';
import { ethers } from 'ethers';
import type { GroupProfile } from '@circles-sdk/profiles';
import { parseError } from '@circles-sdk/sdk';

type Step = 'start' | 'form' | 'executed'; // TODO DRY

type CreateGroupFormProps = {
  setStep: Dispatch<SetStateAction<Step>>;
};

export default function CreateGroupForm({ setStep }: CreateGroupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
  });
  const [mintPolicy, setMintPolicy] = useState(mintPolicies[0]);
  const { circles } = useCircles(); // Get circles SDK and address

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validName = isValidName(formData.name) || formData.name.length === 0;
  const validSymbol =
    isValidSymbol(formData.symbol) || formData.symbol.length === 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validName || !validSymbol) return;
  
      try {
          if (circles) {
              const profile: GroupProfile = {
                  name: formData.name,
                  description: formData.description,
                  previewImageUrl: '',
                  imageUrl: undefined,
                  symbol: formData.symbol,
              };
  
              // Directly call the registerGroupV2 function from the SDK
              const avatar = await circles.registerGroupV2(mintPolicy.name, profile);
              console.log('Avatar created:', avatar);
              setStep('executed'); // Move to the next step if needed
          }
      } catch (error: any) {
          console.error('Failed to create group:', error);
  
          // Attempt to decode the error using parseError
          if (error.data) {
              const decodedError = parseError(error.data);
              if (decodedError) {
                  console.error('Decoded Error:', decodedError);
              } else {
                  console.error('Could not decode the error.');
              }
          }
      }
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className='w-full h-full flex flex-col items-center justify-center gap-y-4'
    >
      <h1 className='text-2xl text-center font-bold'>CREATE GROUP</h1>
      <div className='flex w-full gap-x-2'>
        <Field className='w-4/5'>
          <Label className='text-sm/6 font-medium text-black'>Name</Label>
          <Input
            required
            type='text'
            name='name'
            value={formData.name}
            placeholder='Group Name...'
            className='mt-1 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
            onChange={handleChange}
          />
          <p className='text-xs text-accent h-4 pl-1'>
            {!validName && 'Invalid name'}
          </p>
        </Field>
        <Field className='w-1/5'>
          <Label className='text-sm/6 font-medium text-black'>Symbol</Label>
          <Input
            required
            name='symbol'
            value={formData.symbol}
            placeholder='CRC...'
            className='mt-1 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
            onChange={handleChange}
          />
          <p className='text-xs text-accent h-4 pl-1'>
            {!validSymbol && 'Invalid symbol'}
          </p>
        </Field>
      </div>
      <Field className='w-full'>
        <Label className='text-sm/6 font-medium text-black'>Description</Label>
        <Textarea
          name='description'
          value={formData.description}
          placeholder='Group Description...'
          className='mt-1 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
          onChange={handleChange}
        />
      </Field>
      <Field className='w-full'>
        <Label className='text-sm/6 font-medium text-black'>
          Base Mint Policy
        </Label>
        <MintPolicy mintPolicy={mintPolicy} setMintPolicy={setMintPolicy} />
      </Field>
      <button
        type='submit'
        disabled={!validName || !validSymbol}
        className='flex items-center bg-accent rounded-full px-3 py-1 hover:bg-accent/90 disabled:bg-accent/50 disabled:hover:bg-accent/50 text-white transition duration-300 ease-in-out'
      >
        Create
        <ArrowRightIcon className='h-4 w-4 ml-1' />
      </button>
    </form>
  );
}
