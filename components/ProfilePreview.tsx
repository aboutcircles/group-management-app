import Image from 'next/image';
import { ProfileWithAddress } from '@/types';

export default function ProfilePreview({
  profile,
}: {
  profile: ProfileWithAddress;
}) {
  return (
    <div className='flex items-center'>
      {profile.previewImageUrl ? (
        <Image
          src={profile.previewImageUrl}
          alt={profile.name}
          width={30}
          height={30}
          className='rounded-full'
        />
      ) : (
        <div className='w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold'>
          {profile.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className='flex flex-col'>
        <div className='ml-2 font-bold'>{profile.name}</div>
        <div className='ml-2 text-xs text-zinc-500 break-all'>
          {profile.address}
        </div>
      </div>
    </div>
  );
}
