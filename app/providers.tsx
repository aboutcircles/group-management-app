'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from '@/wagmi';
import Connect from '@/components/layout/Connect';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CirclesSdk from '@/components/layout/CirclesSdk';

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Connect />
        <CirclesSdk />
        {props.children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
