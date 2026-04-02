'use client';

import { useMemo, type ReactNode } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { SOLANA_RPC_URL } from '@/lib/constants';

/**
 * SolanaProvider — Wraps the app with Solana wallet connection.
 * 
 * Modern wallets (Phantom, Backpack, Solflare) auto-register via
 * the Wallet Standard, so no explicit wallet list needed.
 */
export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => SOLANA_RPC_URL, []);
  
  // Memoize wallets array to prevent duplicate registrations in React 19 StrictMode
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
