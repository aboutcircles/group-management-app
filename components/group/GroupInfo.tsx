import { useState } from 'react';
import { Field, Textarea } from '@headlessui/react';
import ImgUpload from './FileUpload';
import { truncateAddress } from '@/utils/truncateAddress';
import { useGroupStore } from '@/stores/groupStore';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Group } from '@/types';
import Loader from './Loader';

export default function GroupInfo() {
  const groupInfo = useGroupStore((state) => state.groupInfo);
  const updateGroup = useGroupStore((state) => state.updateGroup);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: groupInfo?.name || '',
    description: groupInfo?.description || '',
    previewImageUrl: groupInfo?.previewImageUrl || '',
    imageUrl: groupInfo?.imageUrl || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const _isChanged = value !== groupInfo?.[name as keyof Group];
    setIsChanged(_isChanged);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

            const _isChanged = imageDataUrl !== groupInfo?.previewImageUrl;
            setIsChanged(_isChanged);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const profile = {
        name: formData.name,
        description: formData.description,
        previewImageUrl: formData.previewImageUrl,
      };

      const receipt = await updateGroup(profile);
      console.log('Profile updated successfully:', receipt);
      setIsChanged(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error while updating profile:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full h-full p-4 flex flex-col items-center justify-between gap-y-4'
    >
      <div className='flex w-full gap-x-2'>
        <Field className='flex flex-col justify-center'>
          <ImgUpload
            onFileSelected={handleFileSelected}
            fileType='image'
            imgUrl={groupInfo?.previewImageUrl}
          />
        </Field>
        <div className='flex flex-1 flex-col gap-y-2 pl-4'>
          <Field className='w-full'>
            <p className='text-xs text-gray mx-3 break-all'>
              {groupInfo?.group}
            </p>
            <Textarea
              name='name'
              value={formData.name}
              placeholder='Group Name'
              className='block w-full rounded-lg border-none bg-transparent py-1.5 px-3 text-2xl font-bold text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25 resize-none'
              onChange={handleChange}
              rows={1}
            />
          </Field>

          <Field className='w-full flex-1'>
            <Textarea
              name='description'
              value={formData.description}
              placeholder='Group Description...'
              className='mt-1 block w-full rounded-lg border-none bg-transparent py-1.5 px-3 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25 resize-none'
              onChange={handleChange}
            />
          </Field>
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
      <button
        type='submit'
        className='flex items-center bg-accent rounded-full px-3 py-1 hover:bg-accent/90 disabled:bg-secondary text-white transition duration-300 ease-in-out mt-4 shadow-md'
        disabled={!isChanged}
      >
        {isLoading ? (
          <>
            <div className='mr-2'>
              <Loader />
            </div>
            Processing
          </>
        ) : (
          <>
            Save Changes
            <CheckIcon className='h-5 w-5 ml-1' />
          </>
        )}
      </button>
    </form>
  );
}
