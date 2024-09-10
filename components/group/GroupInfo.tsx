import { useState } from 'react';
import { Description, Field, Input, Label, Textarea } from '@headlessui/react';
import ImgUpload from './ImgUpload';
import { truncateAddress } from '@/utils/truncateAddress';
import { Group } from '@/types';
import { useGroupStore } from '@/stores/groupStore';

export default function GroupInfo() {
  const groupInfo = useGroupStore((state) => state.groupInfo);

  const [formData, setFormData] = useState({
    name: groupInfo?.name,
    symbol: groupInfo?.symbol,
    description: groupInfo?.description,
  });

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
          <ImgUpload
            onFileSelected={handleFileSelected}
            imgUrl={groupInfo?.previewImageUrl}
          />
        </Field>
        <div className='flex flex-1 flex-col gap-y-2 w-full pl-4'>
          <h2 className='w-full font-bold text-2xl px-3'>{groupInfo?.name}</h2>
          <Field className='w-full flex-1'>
            <Textarea
              name='description'
              value={formData.description}
              placeholder='Group Description...'
              className='mt-1 block w-full rounded-lg border-none bg-transparent py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
              onChange={handleChange}
            />
          </Field>
          {/* <p className='text-xs text-gray mx-3'>{group.members} members</p> */}
          <div className='flex'>
            <p className='font-bold mx-3'>{groupInfo?.symbol}</p>
            {/* <p className=''>{group.balance}</p> */}
          </div>
          {groupInfo?.mint && (
            <p className='text-xs text-gray mx-3'>
              Mint policy: {truncateAddress(groupInfo.mint)}
            </p>
          )}
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
