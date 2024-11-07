import { Pagination as FlowbitePagination, theme } from 'flowbite-react';
import { twMerge } from 'tailwind-merge';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // console.log('currentPage', currentPage);
  // console.log('totalPages', totalPages);
  return (
    <FlowbitePagination
      currentPage={currentPage}
      onPageChange={onPageChange}
      totalPages={totalPages}
      theme={{
        pages: {
          base: twMerge(theme.pagination.pages.base, 'mt-0'),
          next: {
            base: twMerge(
              theme.pagination.pages.next.base,
              'enabled:hover:bg-primary enabled:hover:text-white'
            ),
            icon: 'h-6 w-6',
          },
          previous: {
            base: twMerge(
              theme.pagination.pages.previous.base,
              'enabled:hover:bg-primary enabled:hover:text-white'
            ),
            icon: 'h-6 w-6',
          },
          selector: {
            base: twMerge(
              'w-12 border border-gray-300 bg-white py-2 leading-tight text-gray-500 enabled:hover:bg-primary enabled:hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-primary',
              'w-9 py-2 text-sm'
            ),
            active:
              'bg-[#BAB7DD] !hover:bg-[#BAB7DD] !enabled:hover:bg-[#BAB7DD]',
          },
        },
      }}
    />
  );
};
