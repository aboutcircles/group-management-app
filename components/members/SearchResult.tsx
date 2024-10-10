import React, { useRef, useEffect } from 'react';
import ProfilePreview from '@/components/members/ProfilePreview';
import { ProfileWithAddress } from '@/types';
import { Button } from 'flowbite-react';
import { HiX } from 'react-icons/hi';

interface SearchResultProps {
  profile: ProfileWithAddress;
  style?: 'dark' | 'light' | 'auto';
  onClose: () => void;
}

export const SearchResult: React.FC<SearchResultProps> = ({
  profile,
  style = 'light',
  onClose,
}) => {
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultRef.current &&
        !resultRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const baseClasses =
    'w-full absolute z-10 inline-block rounded-lg px-3 py-2 text-sm font-medium shadow-sm';
  const styleClasses = {
    dark: 'bg-gray-900 text-white dark:bg-gray-700',
    light: 'border border-gray-200 bg-white text-gray-900',
    auto: 'border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white',
  };

  return (
    <div className='relative w-full' ref={resultRef}>
      <div
        className={`
        ${baseClasses}
        ${styleClasses[style]}
        transition-opacity
        visible opacity-100'
      `}
      >
        <div className='relative z-20 flex flex-col gap-2 items-center py-5'>
          <ProfilePreview profile={profile} full cleanup={onClose} />
          <Button
            color='gray'
            onClick={onClose}
            className='mt-0 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-primary-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-gray-600 sm:w-auto [&>span]:text-sm hover:[&>span]:text-gray-900'
          >
            <HiX className='-ml-1 mr-1 h-5 w-5' />
            Discard
          </Button>
        </div>
      </div>
    </div>
  );
};
