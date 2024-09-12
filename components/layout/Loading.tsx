import Circles from '@/public/circlesLogo.svg';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className='min-h-[100px] flex items-center justify-center'>
      <Image
        src={Circles}
        alt='Loading'
        width={50}
        height={50}
        className='animate-pulse'
      />
    </div>
  );
}
