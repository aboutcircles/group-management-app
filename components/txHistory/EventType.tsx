import { ArrowDownLeftIcon } from '@heroicons/react/24/outline';
import { HiCheck, HiOutlinePlusSm, HiOutlineX } from 'react-icons/hi';

export default function EventType({ type }: { type: string }) {
  return (
    <div className='flex gap-2 items-center text-gray'>
      {type === 'trust' && <HiCheck className='w-5 h-5' />}
      {type === 'untrust' && <HiOutlineX className='w-5 h-5' />}
      {type === 'trusted by' && <ArrowDownLeftIcon className='w-5 h-5' />}
      {type === 'untrusted by' && <HiOutlineX className='w-5 h-5' />}
      {type === 'mint' && <HiOutlinePlusSm className='w-5 h-5' />}
      <p className='text-sm capitalize'>{type}</p>
    </div>
  );
}

// trust
// untrust
// trusted by
// untrusted by
// mint

// group info updated
