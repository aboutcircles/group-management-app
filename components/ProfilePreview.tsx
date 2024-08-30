import { type Profile } from '@circles-sdk/profiles';
import Image from 'next/image';

export default function ProfilePreview({ profile }: { profile: Profile }) {
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
        <div className='w-[30px] h-[30px] bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold'>
          {profile.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className='ml-2 font-bold'>{profile.name}</div>
    </div>
  );
}
