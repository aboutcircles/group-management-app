'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useState } from 'react';
import { Field, Input, Label, Textarea } from '@headlessui/react';
import { isValidName, isValidSymbol } from '@/utils/isValid';
import MintPolicy from '@/components/group/MintPolicy';
import FileUpload from '@/components/group/FileUpload';
import { GroupProfile } from '@circles-sdk/profiles';
import Loader from '@/components/group/Loader';
import { mintPolicies } from '@/const';
import { useGroupStore } from '@/stores/groupStore';
import { Address } from 'viem';
import { Step } from '@/types';
import Button from '@/components/common/Button';
import { HiCheck } from 'react-icons/hi';
// import { Button } from 'flowbite-react';

type CreateGroupFormProps = {
  setStep: Dispatch<SetStateAction<Step>>;
};

export default function CreateGroupForm({ setStep }: CreateGroupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<GroupProfile>({
    name: '',
    symbol: '',
    description: '',
    previewImageUrl: '',
    imageUrl: '',
  });

  const [mintPolicy, setMintPolicy] = useState(mintPolicies[0]);

  const createGroup = useGroupStore((state) => state.createGroup);

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

  const handleFileSelected = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const cropWidth = 256;
          const cropHeight = 256;

          if (ctx) {
            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(img, 0, 0, cropWidth, cropHeight);

            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.3);

            if (imageDataUrl.length > 150 * 1024) {
              console.warn('Image size exceeds 150 KB after compression');
            }

            setFormData((prevData) => ({
              ...prevData,
              previewImageUrl: imageDataUrl,
            }));
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validName || !validSymbol) return;
    setIsLoading(true);
    const newGroup = await createGroup(mintPolicy.address as Address, formData);
    if (newGroup) {
      console.log('newGroup from form', newGroup);
      setStep('executed');
    } else {
      setStep('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full h-full flex flex-col items-center justify-center text-xs md:text-sm/6 text-black'
    >
      <h1 className='text-xl text-center font-extrabold text-accent mb-8'>
        CREATE GROUP
      </h1>
      <div className='flex flex-col md:flex-row w-full gap-x-2'>
        <div className='flex flex-col w-full md:w-2/3'>
          <Field className='w-full'>
            <Label className='font-medium'>Name</Label>
            <Input
              required
              type='text'
              name='name'
              value={formData.name}
              placeholder='Group Name...'
              className='mt-1 shadow-sm block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
              onChange={handleChange}
            />
            <p className='text-xs text-accent h-4 pl-1'>
              {!validName && 'Invalid name'}
            </p>
          </Field>
          <Field className='w-full'>
            <Label className='font-medium'>Symbol</Label>
            <Input
              required
              name='symbol'
              value={formData.symbol}
              placeholder='CRC...'
              className='mt-1 shadow-sm block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
              onChange={handleChange}
            />
            <p className='text-xs text-accent h-4 pl-1'>
              {!validSymbol && 'Invalid symbol'}
            </p>
          </Field>
        </div>
        <Field className='w-full md:w-1/3 flex flex-col items-center'>
          <Label className='font-medium'>Group Image</Label>
          <FileUpload onFileSelected={handleFileSelected} fileType='image' />
        </Field>
      </div>
      <div className='flex flex-col md:flex-row items-center w-full'>
        <Field className='w-full'>
          <Label className='font-medium'>Description</Label>
          <Textarea
            name='description'
            value={formData.description}
            placeholder='Group Description...'
            className='mt-1 shadow-sm h-20 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
            onChange={handleChange}
          />
        </Field>
      </div>
      <Field className='w-full flex flex-col mt-4'>
        <Label className='font-medium'>Base Mint Policy</Label>
        <MintPolicy mintPolicy={mintPolicy} setMintPolicy={setMintPolicy} />
      </Field>
      <Button
        type='submit'
        disabled={!validName || !validSymbol}
        icon={<HiCheck className='w-5 h-5 mr-1' />}
        loading={isLoading}
      >
        Create
      </Button>
    </form>
  );
}
