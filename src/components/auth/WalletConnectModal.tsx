import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import { X, Wallet as WalletIcon, Check, Loader2, Info } from 'lucide-react';
import Image from 'next/image';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { wallets, select, connected, connecting, wallet: selectedWallet } = useWallet();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Close modal automatically if connected
  useEffect(() => {
    if (connected) {
      setTimeout(() => onClose(), 500); // Small delay for user to see success
    }
  }, [connected, onClose]);

  if (!isOpen || !hasHydrated) return null;

  const handleWalletSelect = (walletName: WalletName) => {
    select(walletName);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 glass-strong shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Effects */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-foreground mb-1">Connect Wallet</h2>
              <p className="text-sm text-muted-foreground">Select a Solana wallet to continue</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3 relative z-20">
            {wallets.length === 0 ? (
              <div className="text-center p-6 border border-white/5 bg-black/20 rounded-2xl">
                <WalletIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium text-muted-foreground">No Solana wallets detected.</p>
                <p className="text-xs text-muted-foreground mt-1">Please install Phantom or Solflare to continue.</p>
              </div>
            ) : (
              Array.from(new Map(wallets.map(w => [w.adapter.name, w])).values()).map((walletParams, idx) => {
                const isSelected = selectedWallet?.adapter.name === walletParams.adapter.name;
                const isReady = walletParams.readyState === 'Installed' || walletParams.readyState === 'Loadable';

                return (
                  <button
                    key={`${walletParams.adapter.name}-${idx}`}
                    onClick={() => handleWalletSelect(walletParams.adapter.name)}
                    disabled={!isReady || connecting}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                      isSelected 
                        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,230,118,0.15)]' 
                        : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    } ${!isReady ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center p-2 shadow-inner border border-white/5">
                        <img 
                          src={walletParams.adapter.icon} 
                          alt={`${walletParams.adapter.name} icon`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-foreground group-hover:text-white transition-colors">
                          {walletParams.adapter.name}
                        </span>
                        {!isReady && (
                          <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground">
                            Not Detected
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      {isSelected && connecting ? (
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      ) : isSelected && connected ? (
                        <Check className="h-5 w-5 text-primary" />
                      ) : isReady ? (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/10 text-white/70 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          Connect
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
              <Info className="h-3 w-3" /> By connecting, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
