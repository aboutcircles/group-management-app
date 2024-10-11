import React from 'react';
import { Tooltip as FlowbiteTooltip, TooltipProps } from 'flowbite-react';
import { HiQuestionMarkCircle } from 'react-icons/hi';

export const Tooltip: React.FC<{
  content: string;
  placement?: TooltipProps['placement'];
  children?: React.ReactNode;
}> = ({ content, placement = 'top', children }) => {
  return (
    <FlowbiteTooltip
      content={content}
      trigger='hover'
      style='light'
      placement={placement}
    >
      {children || <HiQuestionMarkCircle className='w-5 h-5 text-gray-500' />}
    </FlowbiteTooltip>
  );
};
