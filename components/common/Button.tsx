import { Button as FlowbiteButton } from 'flowbite-react';
import Loader from '../group/Loader';

export default function Button({
  type,
  children,
  icon,
  loading,
  disabled,
  handleClick,
}: {
  type: 'submit' | 'button' | 'reset';
  children: React.ReactNode;
  icon: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  handleClick?: () => void;
}) {
  return (
    <FlowbiteButton
      type={type}
      className='bg-primary flex items-center justify-center font-medium'
      disabled={disabled}
      // isProcessing={loading}
      onClick={handleClick}
    >
      <span className='mr-2'>{loading ? <Loader /> : icon}</span>
      {children}
    </FlowbiteButton>
  );
}
