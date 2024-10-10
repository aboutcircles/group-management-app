import { useState } from 'react';
import ImgUpload from './FileUpload';
import { truncateAddress } from '@/utils/truncateAddress';
import { useGroupStore } from '@/stores/groupStore';
// import { CheckIcon } from '@heroicons/react/24/outline';
import { HiCheck } from 'react-icons/hi';
import { Group } from '@/types';
import { ethers } from 'ethers';
import { Label, TextInput, Textarea } from 'flowbite-react';
import { Button } from '@/components/common/Button';
import { Tooltip } from '@/components/common/Tooltip';

export default function GroupInfo() {
  const groupInfo = useGroupStore((state) => state.groupInfo);
  const totalSupply = useGroupStore((state) => state.totalSupply);
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

  const formatEther = (value: bigint | undefined) => {
    const num = parseFloat(ethers.formatEther(value || BigInt(0)));
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
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
    <form onSubmit={handleSubmit} className='w-full flex flex-col gap-y-5'>
      <div className='flex flex-row sm:flex-col w-full gap-2 items-center'>
        <div className='flex flex-col justify-center'>
          <ImgUpload
            onFileSelected={handleFileSelected}
            fileType='image'
            imgUrl={groupInfo?.previewImageUrl}
          />
        </div>
        <div className='flex flex-col w-auto sm:w-full'>
          <p className='w-full text-xs text-gray-500 text-left break-all mb-2 sm:mb-5'>
            {groupInfo?.group
              ? truncateAddress(groupInfo.group)
              : 'No group address'}
          </p>
          <TextInput
            name='name'
            value={formData.name}
            placeholder='Group Name'
            className='text-2xl font-bold'
            onChange={handleChange}
            theme={{
              field: {
                input: {
                  base: '!bg-white !px-0 !text-2xl !font-bold border-none focus:ring-0 focus:border w-full !py-0',
                },
              },
            }}
          />
        </div>
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label
          htmlFor='message'
          className='dark:text-white text-sm flex items-center gap-1'
        >
          Description
          <Tooltip content='A brief description of your group.' />
        </Label>
        <Textarea
          id='description'
          name='description'
          value={formData.description}
          placeholder='Description goes here...'
          rows={6}
          className='[&_input]:p-3'
          onChange={handleChange}
        />
      </div>

      <div className='w-full flex flex-col gap-2'>
        <Label
          htmlFor='totalSupply'
          className='dark:text-white text-sm flex items-center gap-1'
        >
          Total supply
          <Tooltip content='The total number of group tokens currently in circulation.' />
        </Label>
        <p className='flex text-black' id='totalSupply'>
          <span className='text-2xl overflow-hidden text-ellipsis'>
            {formatEther(totalSupply || BigInt(0))}
          </span>
          <span className='ml-2 text-2xl font-bold'>{groupInfo?.symbol}</span>
        </p>
      </div>
      {groupInfo?.mint && (
        <p className='font-medium text-base text-gray-400 w-full'>
          Mint policy: {truncateAddress(groupInfo.mint)}
        </p>
      )}
      <Button
        type='submit'
        disabled={!isChanged}
        loading={isLoading}
        icon={<HiCheck className='h-5 w-5' />}
      >
        Save Changes
      </Button>
    </form>
  );
}
