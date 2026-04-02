'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { LogIn, LogOut, Loader2, User } from 'lucide-react';
import bs58 from 'bs58';

import { useAuthStore } from '@/store/useAuthStore';
import { buildSignMessage } from '@/lib/auth';

/**
 * Custom Auth Flow using Privy:
 * 1. Login triggers Privy's gorgeous Social + Web3 Modal.
 * 2. Privy authenticates (user is logged into Privy).
 * 3. We use the resulting embedded or external wallet to sign our standard Scorendo JWT payload.
 */
export function AuthButton() {
  const { login, logout: privyLogout, authenticated, ready, user: privyUser, createWallet, signMessage: privySignMessage, getAccessToken } = usePrivy();
  const { wallets } = useWallets(); // Privy's tracked wallets (includes embedded Google wallets)
  
  const isStoreAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const storeUser = useAuthStore((s) => s.user);
  
  const loginStore = useAuthStore((s) => s.login);
  const logoutStore = useAuthStore((s) => s.logout);
  const fetchSession = useAuthStore((s) => s.fetchSession);

  const [isSigning, setIsSigning] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const handleDisconnect = async () => {
    // 1. Disconnect Privy
    if (authenticated) {
      await privyLogout();
    }
    // 2. Disconnect Backend Session
    await fetch('/api/auth/logout', { method: 'POST' });
    logoutStore();
  };

  const handleScorendoSync = async () => {
    // We must have either an active browser wallet OR an embedded privy wallet
    const userAddress = wallets.find(w => (w as any).chainType === 'solana')?.address || wallets[0]?.address || privyUser?.wallet?.address;
    if (!userAddress) return;

    try {
      setIsSigning(true);
      
      const sessionToken = await getAccessToken();

      if (sessionToken) {
        // FAST ROUTE: Frictionless JWT authentication verified by our backend directly
        const response = await fetch('/api/auth/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: sessionToken,
            publicKey: userAddress,
            profile: {
              email: privyUser?.email?.address || privyUser?.google?.email || privyUser?.twitter?.subject,
              name: privyUser?.google?.name || privyUser?.twitter?.name,
              avatar: (privyUser?.google as any)?.picture || privyUser?.twitter?.profilePictureUrl,
            }
          }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          loginStore(data.user);
          return;
        }
        console.warn('Social silent auth failed, falling back to Web3 signature', data.error);
        
        // If the user is using an internal Privy embedded wallet (from Google/Email), falling back to a manual Signature is bad UX and might crash.
        const isExternalWallet = wallets.length > 0 && (wallets[0] as any).walletClientType !== 'privy';
        
        if (!isExternalWallet) {
           setIsSigning(false);
           setAuthError(`Verification Error: ${data.error}`);
           return;
        }
      }

      // SLOW ROUTE: Legacy Web3 Cryptographic verification if JWT fails or is unavailable
      const message = buildSignMessage();
      let signaturePayload;

      if (wallets.length > 0) {
        const activeWallet = wallets.find(w => (w as any).chainType === 'solana') || wallets[0];
        // Duck-typing the wallet object to find the appropriate signMessage method
        if (typeof (activeWallet as any).signMessage === 'function') {
          try {
            signaturePayload = await (activeWallet as any).signMessage(message);
          } catch (err) {
            console.warn('String signature failed, falling back to Uint8Array', err);
            const messageBytes = new TextEncoder().encode(message);
            signaturePayload = await (activeWallet as any).signMessage(messageBytes);
          }
        } else if (typeof (activeWallet as any).getSolanaProvider === 'function') {
          const provider = await (activeWallet as any).getSolanaProvider();
          const messageBytes = new TextEncoder().encode(message);
          const signedResponse = await provider.signMessage(messageBytes);
          signaturePayload = signedResponse.signature || signedResponse;
        } else if (typeof (activeWallet as any).getProvider === 'function') {
          const provider = await (activeWallet as any).getProvider();
          if (typeof provider.signMessage === 'function') {
            const messageBytes = new TextEncoder().encode(message);
            const signedResponse = await provider.signMessage(messageBytes);
            signaturePayload = signedResponse.signature || signedResponse;
          } else {
            throw new Error('Provider does not support signMessage');
          }
        } else {
          throw new Error('No signature method found on activeWallet');
        }
      } else {
        // Fallback for Embedded Wallets that exist in Privy but aren't actively in useWallets array
        const signedMessage = await privySignMessage({ message });
        signaturePayload = signedMessage;
      }

      // Convert format gracefully
      const signature = typeof signaturePayload === 'string' 
        ? signaturePayload // Privy returns base58/hex string natively for some providers
        : bs58.encode(signaturePayload);

      const legacyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          signature,
          publicKey: userAddress,
          profile: {
            email: privyUser?.email?.address || privyUser?.google?.email || privyUser?.twitter?.subject,
            name: privyUser?.google?.name || privyUser?.twitter?.name,
            avatar: (privyUser?.google as any)?.picture || privyUser?.twitter?.profilePictureUrl,
          }
        }),
      });

      const legacyData = await legacyResponse.json();

      if (legacyResponse.ok && legacyData.success) {
        loginStore(legacyData.user);
      } else {
        console.error('Scorendo Login failed:', legacyData.error);
      }
    } catch (error) {
      console.error('Signature process failed:', error);
    } finally {
      setIsSigning(false);
    }
  };

  // AUTOMATIC SESSION SYNC
  // Radically improves Web2.5 UX by eliminating the need to click "Secure Entry"
  useEffect(() => {
    if (authenticated && !isStoreAuthenticated && ready && !isSigning) {
       const userAddress = privyUser?.wallet?.address || wallets[0]?.address;
       if (userAddress) {
         handleScorendoSync();
       }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, isStoreAuthenticated, ready, privyUser, wallets.length]);

  // State 1: Loading
  if (!ready || isLoading) {
    return (
      <div className="flex items-center justify-center px-4 h-10 rounded-xl bg-white/5 border border-white/10 w-32">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // State 2: Fully Authenticated in Frontend (Privy) & Backend (Scorendo JWT)
  if (authenticated && isStoreAuthenticated && storeUser) {
    const shortAddress = `${storeUser.walletAddress.slice(0, 4)}...${storeUser.walletAddress.slice(-4)}`;
    const email = privyUser?.email?.address || privyUser?.google?.email || privyUser?.twitter?.subject;
    const avatar = (privyUser?.google as any)?.picture || privyUser?.twitter?.profilePictureUrl;
    
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-3 mr-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-7 h-7 rounded-full ring-2 ring-primary/20" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/30">
              <User className="h-3.5 w-3.5 text-primary" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary">{storeUser.totalPoints} PTS</span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{email || shortAddress}</span>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 rounded-xl glass border border-border/50 hover:bg-white/5 hover:border-destructive/50 transition-all group"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors sm:mr-2" />
          <span className="hidden sm:inline text-sm font-medium text-foreground group-hover:text-destructive">Sign Out</span>
        </button>
      </div>
    );
  }

  // State 3: User logged into Privy (Social/Wallet) but needs to create a Session in Scorendo Database
  if (authenticated && !isStoreAuthenticated) {
    if (wallets.length === 0 && !privyUser?.wallet) {
      
      const handleManualCreateWallet = async () => {
        if (!createWallet) return;
        try {
          setIsSigning(true);
          await createWallet();
        } catch (e) {
          console.error('Failed to create embedded wallet', e);
        } finally {
          setIsSigning(false);
        }
      };

      return (
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualCreateWallet}
            disabled={isSigning || !createWallet}
            className="relative flex items-center justify-center gap-2 px-5 h-10 rounded-xl bg-gold/20 border border-gold text-gold font-semibold hover:bg-gold/30 transition-all"
          >
            {isSigning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gold animate-pulse"/> Provision Wallet</span>
            )}
          </button>
          <button onClick={handleDisconnect} className="flex items-center justify-center h-10 w-10 rounded-xl glass border border-border/50 hover:bg-white/5 hover:border-destructive/50 transition-all group">
            <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          </button>
        </div>
      );
    }

    const email = privyUser?.email?.address || privyUser?.google?.email || privyUser?.twitter?.subject;
    const avatar = (privyUser?.google as any)?.picture || privyUser?.twitter?.profilePictureUrl;

    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
          {avatar ? (
            <img src={avatar} alt="Profile" className="w-6 h-6 rounded-full opacity-80" />
          ) : (
             <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center opacity-80">
               <User className="h-3 w-3 text-primary" />
             </div>
          )}
          <span className="text-xs font-medium text-muted-foreground truncate max-w-[120px]">{email || 'New User'}</span>
        </div>

        <button
          onClick={handleScorendoSync}
          disabled={isSigning}
          className="relative flex items-center justify-center gap-2 px-5 h-10 rounded-xl bg-primary text-primary-foreground font-semibold hover:glow-green transition-all shadow-[0_0_15px_rgba(0,230,118,0.2)]"
        >
          {isSigning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Secure Entry</span>
            </>
          )}
        </button>

        <button
          onClick={handleDisconnect}
          className="flex items-center justify-center h-10 w-10 rounded-xl glass border border-border/50 hover:bg-white/5 hover:border-destructive/50 transition-all group"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
        </button>

        {authError && (
          <div className="absolute top-12 right-0 mt-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl shadow-xl w-64 z-50">
            <p className="font-bold mb-1">Server Verification Error</p>
            <p>{authError}</p>
          </div>
        )}
      </div>
    );
  }

  // State 4: Disconnected (Prompt to connect via Privy Social + Web3)
  return (
    <button
      onClick={() => login()}
      className="flex items-center justify-center gap-2 px-6 h-10 rounded-xl glass border border-primary/30 hover:bg-primary/20 hover:border-primary/60 transition-all group shadow-[0_0_15px_rgba(0,230,118,0.1)]"
    >
      <User className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
      <span className="text-sm font-bold text-white whitespace-nowrap">Sign In / Play</span>
    </button>
  );
}
