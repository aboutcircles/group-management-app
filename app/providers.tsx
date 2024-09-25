'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from '@/wagmi';
import Connect from '@/components/layout/Connect';
import CirclesSdk from '@/components/layout/CirclesSdk';
import { NextUIProvider } from '@nextui-org/react';

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextUIProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Connect />
          <CirclesSdk />
          {props.children}
        </QueryClientProvider>
      </WagmiProvider>
    </NextUIProvider>
  );
}
