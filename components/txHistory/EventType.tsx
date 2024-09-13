import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function EventType({ type }: { type: string }) {
  return (
    <div className='flex gap-2 items-center text-gray'>
      {type === 'trust' && <ArrowUpRightIcon className='w-5 h-5' />}
      {type === 'untrust' && <XMarkIcon className='w-5 h-5' />}
      {type === 'trusted by' && <ArrowDownLeftIcon className='w-5 h-5' />}
      {type === 'untrusted by' && <XMarkIcon className='w-5 h-5' />}
      {type === 'mint' && <PlusIcon className='w-5 h-5' />}
      <p className='text-sm'>{type}</p>
    </div>
  );
}

// trust
// untrust
// trusted by
// untrusted by
// mint
