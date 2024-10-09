import { Tooltip as FlowbiteTooltip, TooltipProps } from 'flowbite-react';
import { HiQuestionMarkCircle } from 'react-icons/hi';

export const Tooltip = ({
  content,
  placement = 'top', // placement: top, right, bottom, left
}: {
  content: string;
  placement?: TooltipProps['placement'];
}) => {
  return (
    <FlowbiteTooltip
      content={content}
      trigger='hover'
      style='light'
      placement={placement}
    >
      <HiQuestionMarkCircle className='w-5 h-5' />
    </FlowbiteTooltip>
  );
};
