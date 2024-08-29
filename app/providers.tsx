'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from '@/wagmi';
import Connect from '@/components/Connect';
import { CirclesSDKProvider } from '@/contexts/circlesSdk';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CirclesSDKProvider>
          <Connect />
          {props.children}
          <ReactQueryDevtools initialIsOpen={false} />
        </CirclesSDKProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
