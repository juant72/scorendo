"use client";
import React from 'react';

export function SharePredictionButton({ text, url }: { text: string; url?: string }) {
  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Prediction', text, url: url || window.location.href });
      } catch (e) {
        console.error('Share cancelled', e);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text + (url ? ` ${url}` : ''));
        alert('Prediction copied to clipboard');
      } catch {
        alert('Share not available on this browser');
      }
    }
  };

  return (
    <button onClick={onShare} className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10">
      Share
    </button>
  );
}
