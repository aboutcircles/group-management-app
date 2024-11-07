'use client';

import { truncateAddress } from '@/utils/truncateAddress';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { HiCheck } from 'react-icons/hi';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function ConnectButton() {
  const { address } = useAccount();
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    } else {
      window.open('https://app.safe.global/');
    }
  };

  return (
    <button
      onClick={handleClick}
      className='flex bg-secondary rounded-full text-sm px-2 py-1 border-2 border-transparent hover:border-white transition duration-300 ease-in-out'
    >
      {address ? (
        <>
          {isCopied ? (
            <HiCheck className='ml-2 h-5 w-5' />
          ) : (
            truncateAddress(address)
          )}
        </>
      ) : (
        'Open via Safe App'
      )}
    </button>
  );
}
