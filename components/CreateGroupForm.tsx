import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useState } from 'react';
import { Description, Field, Input, Label } from '@headlessui/react';
import { isValidName, isValidSymbol } from '@/utils/isValid';

type Step = 'start' | 'form' | 'executed'; // TODO DRY

type CreateGroupFormProps = {
  setStep: Dispatch<SetStateAction<Step>>;
};

export default function CreateGroupForm({ setStep }: CreateGroupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // setStep('executed');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full h-full flex flex-col items-center justify-center gap-y-4'
    >
      <h1 className='text-2xl text-center font-bold'>CREATE GROUP</h1>
      <Field className='w-5/6 md:w-3/5'>
        <Label className='text-sm/6 font-medium text-black'>Name</Label>
        <Input
          required
          type='text'
          name='name'
          value={formData.name}
          // pattern="^[0-9A-Za-z \-_.()'&+#]*$"
          placeholder='Group Name...'
          className='mt-1 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
          onChange={handleChange}
        />
        <p className='text-xs text-accent h-4 pl-1'>
          {!validName && 'Invalid name'}
        </p>
      </Field>
      <div className='flex w-5/6 md:w-3/5 gap-x-2'>
        <Field className='w-full'>
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
        {/* <Field className='w-full'>
            <Label className='text-sm/6 font-medium text-black'>Fee (%)</Label>
            <Input
              required
              placeholder='0'
              className='mt-1 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
            />
          </Field> */}
      </div>
      {/* <Field className='w-5/6 md:w-3/5'>
          <Label className='text-sm/6 font-medium text-black'>Treasury</Label>
          <Input
            required
            placeholder='0x...'
            className='mt-1 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
          />
        </Field> */}
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
