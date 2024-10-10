import React, { useState, useRef, useEffect } from 'react';
import ProfilePreview from '@/components/members/ProfilePreview';
import { ProfileWithAddress } from '@/types';

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
  const [isVisible, setIsVisible] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultRef.current &&
        !resultRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
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
        ${isVisible ? 'visible opacity-100' : 'invisible opacity-0'}
      `}
      >
        <div className='relative z-20'>
          <ProfilePreview profile={profile} full />
        </div>
      </div>
    </div>
  );
};
