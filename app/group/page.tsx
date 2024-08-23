'use client';

import Group from '@/components/Group';

const group = {
  name: 'Group Test',
  symbol: 'GRP1',
  description: 'Group 1 Description',
  // image: 'https://via.placeholder.com/150',
  balance: '100',
  members: 108,
};

// const group = null;

export default function Page() {
  return <Group group={group} />;
}
