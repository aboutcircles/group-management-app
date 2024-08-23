import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useState } from 'react';
import { Description, Field, Input, Label, Textarea } from '@headlessui/react';
import { isValidName, isValidSymbol } from '@/utils/isValid';
import MintPolicy, { mintPolicies } from './MintPolicy';
import ImgUpload from './ImgUpload';

export type Group = {
  name: string;
  symbol: string;
  description: string;
  image?: string;
  balance: string;
  members: number;
};

export default function GroupInfo({ group }: { group: Group }) {
  const [formData, setFormData] = useState({
    name: group.name,
    symbol: group.symbol,
    description: group.description,
  });
  const [mintPolicy, setMintPolicy] = useState(mintPolicies[0]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const validName = isValidName(formData.name) || formData.name.length === 0;
  // const validSymbol =
  //   isValidSymbol(formData.symbol) || formData.symbol.length === 0;

  const handleFileSelected = (file: File | null) => {
    console.log(file);
    // TODO: set image
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!validName || !validSymbol) return;

    // setStep('executed');
    // TODO: Create group
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full h-full p-4 flex flex-col items-center justify-center gap-y-4'
    >
      {/* <h1 className='text-2xl text-center font-bold'>CREATE GROUP</h1> */}
      <div className='flex w-full gap-x-2'>
        <Field className=''>
          <ImgUpload onFileSelected={handleFileSelected} imgUrl={group.image} />
        </Field>
        <div className='flex flex-1 flex-col gap-y-2 w-full pl-4'>
          <h2 className='w-full font-bold text-2xl px-3'>{group.name}</h2>
          <Field className='w-full flex-1'>
            <Textarea
              name='description'
              value={formData.description}
              placeholder='Group Description...'
              className='mt-1 block w-full rounded-lg border-none bg-transparent py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
              onChange={handleChange}
            />
          </Field>
          <p className='text-xs text-gray mx-3'>{group.members} members</p>
          <div className='flex'>
            <p className='font-bold mx-3'>{group.symbol}</p>
            <p className=''>{group.balance}</p>
          </div>
        </div>
      </div>

      {/* <Field className='w-full'>
        <Label className='text-sm/6 font-medium text-black'>
          Base Mint Policy
        </Label>
        <MintPolicy mintPolicy={mintPolicy} setMintPolicy={setMintPolicy} />
      </Field> */}
      {/* <button
        type='submit'
        className='flex items-center bg-accent rounded-full px-3 py-1 hover:bg-accent/90 disabled:bg-accent/50 disabled:hover:bg-accent/50 text-white transition duration-300 ease-in-out mt-4'
      >
        Create
        <ArrowRightIcon className='h-4 w-4 ml-1' />
      </button> */}
    </form>
  );
}
