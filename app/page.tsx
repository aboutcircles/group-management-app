'use client';

import Group from '@/components/group/Group';
import RegisterGroup from '@/components/group/RegisterGroup';
import Fallback from '@/components/layout/Fallback';
import Loading from '@/components/layout/Loading';
import { useGroupStore } from '@/stores/groupStore';
import { truncateAddress } from '@/utils/truncateAddress';
import { useAccount } from 'wagmi';

export default function Page() {
  const { address } = useAccount();
  const { groupAvatar, isLoading, isHumanAvatar } = useGroupStore((state) => ({
    groupAvatar: state.groupAvatar,
    isLoading: state.isLoading,
    isHumanAvatar: state.isHumanAvatar,
  }));

  if (isLoading && address) return <Loading />;
  if (!address)
    return (
      <Fallback>
        <p className='text mt-4 text-gray-900 mb-10'>
          Open this application through Safe app at{' '}
          <a
            href='https://app.safe.global/apps'
            target='_blank'
            className='font-bold'
          >
            https://app.safe.global/apps
          </a>{' '}
          to access the dashboard
        </p>
      </Fallback>
    );
  if (isHumanAvatar)
    return (
      <Fallback>
        <p className='text mt-4 text-gray-900 mb-10'>The address <span className='font-bold'>{truncateAddress(address)}</span> is already linked to a human profile, please connect the app with another safe</p>
      </Fallback>
    );
  if (!groupAvatar) return <RegisterGroup />;
  return <Group />;
}
