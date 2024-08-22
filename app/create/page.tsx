'use client';

import Fallback from '@/components/Fallback';
import RegisterGroup from '@/components/RegisterGroup';
import { useAccount } from 'wagmi';

// const group = {
//   name: 'Group Test',
//   symbol: 'GRP1',
//   description: 'Group 1 Description',
//   image: 'https://via.placeholder.com/150',
//   balance: '100',
//   members: 108,
// };

const group = null;

export default function Page() {
  const { address } = useAccount();
  return <>{address ? <RegisterGroup /> : <Fallback />}</>;
}
