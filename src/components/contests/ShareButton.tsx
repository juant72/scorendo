'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareButtonProps {
  inviteCode?: string | null;
  contestName: string;
}

export function ShareButton({ inviteCode, contestName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/contests/join-private?code=${inviteCode}`;
    const text = `Join my private battle on Scorendo: ${contestName}! Use code: ${inviteCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: contestName,
          text: text,
          url: url,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!inviteCode) return null;

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 text-white transition-all group"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-primary">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 opacity-70 group-hover:text-primary transition-colors" />
          <span className="text-xs font-black uppercase tracking-widest">Share Invite</span>
        </>
      )}
    </button>
  );
}
