'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { SolanaProvider } from './SolanaProvider';
import { AudioProvider } from './AudioProvider';
import { SystemCalibration } from '../layout/SystemCalibration';

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['email', 'wallet', 'google', 'twitter'],
        appearance: {
          theme: 'dark',
          accentColor: '#00E676',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          }
        },
        solana: {
          // Solana specific config here
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <SolanaProvider>
          <AudioProvider>
            <SystemCalibration />
            {children}
          </AudioProvider>
        </SolanaProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
