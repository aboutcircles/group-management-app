import { Button as FlowbiteButton } from 'flowbite-react';

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
      className='bg-primary flex items-center justify-center m-2 font-medium'
      disabled={disabled}
      isProcessing={loading}
      onClick={handleClick}
    >
      {icon && icon}
      {children}
    </FlowbiteButton>
  );
}
