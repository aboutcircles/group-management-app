import { useState } from 'react';
import { Description, Field, Input, Label, Textarea } from '@headlessui/react';
import ImgUpload from './ImgUpload';
import { truncateAddress } from '@/utils/truncateAddress';
import { isValidName, isValidSymbol } from "@/utils/isValid";
import { Group } from '@/types';
import {cidV0ToUint8Array} from "@circles-sdk/utils";
import { CirclesSdkContext } from '@/contexts/circlesSdk';
import useCircles from '@/hooks/useCircles';




export default function GroupInfo({ group }: { group: Group }) {
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description,
    previewImageUrl: group.previewImageUrl,
    imageUrl: group.imageUrl,
  });

  console.log('group', group);


  const { circles} = useCircles();

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
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const cropWidth = 256; // Set your desired crop width
          const cropHeight = 256; // Set your desired crop height

          if (ctx) {
            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(img, 0, 0, cropWidth, cropHeight);

            const imageDataUrl = canvas.toDataURL("image/jpeg", 0.3);

            if (imageDataUrl.length > 150 * 1024) {
              console.warn("Image size exceeds 150 KB after compression");
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
  
    try {
      const profile = {
        name: formData.name,
        description: formData.description,
        previewImageUrl: formData.previewImageUrl,
      };
  
      
      if (!circles?.profiles) {
        throw new Error('Circles SDK profiles context is not available.');
      }
      const cid = await circles.profiles.create(profile);
  
      if (!cid) {
        throw new Error('Failed to create profile: CID is undefined');
      }
      const digest = cidV0ToUint8Array(cid);

      if (!circles.nameRegistry) {
        throw new Error('Circles SDK nameRegistry context is not available.');
      }
      const tx = await circles.nameRegistry.updateMetadataDigest(digest);
  
      if (!tx) {
        throw new Error('Failed to create the transaction for updating metadata digest.');
      }
  
      const receipt = await tx.wait();
      console.log('Profile updated successfully:', receipt);
  
    } catch (error) {
      console.error('Error while updating profile:', error);
    }
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
            imgUrl={group.previewImageUrl}
          />
        </Field>
        <div className='flex flex-1 flex-col gap-y-2 w-full pl-4'>
          <Field className='w-full'>
          <h2 className='w-full font-bold text-xl px-3'> Group Name </h2>
            <Textarea
            name='name'
            value={formData.name}
            placeholder='Group Name'
            className='mt-1 block w-full rounded-lg border-none bg-transparent py-1.5 px-3 text-1xl text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25 resize-none'
            onChange={handleChange}
        />
      </Field>
          <Field className='w-full flex-1'>
            <Textarea
              name='description'
              value={formData.description}
              placeholder='Group Description...'
              className='mt-1 block w-full rounded-lg border-none bg-transparent py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25 resize-none'
              onChange={handleChange}
            />
          </Field>
          {/* <p className='text-xs text-gray mx-3'>{group.members} members</p> */}
          <div className='flex'>
            <p className='font-bold mx-3'>{group.symbol}</p>
            {/* <p className=''>{group.balance}</p> */}
          </div>
          {group.mint && (
            <p className='text-xs text-gray mx-3'>
              Mint policy: {truncateAddress(group.mint)}
            </p>
          )}
        </div>
      </div>
      <button
    type='submit'
    className='bg-secondary rounded-full text-sm px-2 py-1 border-2 border-transparent text-white hover:border-white transition duration-300 ease-in-out'
    > Save Changes
  </button>


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
