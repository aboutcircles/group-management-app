import { Button } from 'flowbite-react';
import Loader from '@/components/common/Loader';

export function IconButton({
  type,
  icon,
  loading,
  disabled,
  handleClick,
}: {
  type: 'submit' | 'button' | 'reset';
  icon: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  handleClick?: () => void;
}) {
  return (
    <Button
      type={type}
      className='bg-primary flex items-center justify-center rounded-full [&>span]:p-1'
      disabled={disabled || loading}
      onClick={handleClick}
      size='xl'
    >
      <span>{loading ? <Loader /> : icon}</span>
    </Button>
  );
}
