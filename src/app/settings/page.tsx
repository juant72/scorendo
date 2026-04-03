'use client';

import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, CreditCard, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { PageTransition, FadeInItem } from '@/components/layout/PageTransition';

export default function SettingsPage() {
  const [user, setUser] = useState<{ walletAddress: string; displayName?: string; email?: string } | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/user/profile')
      .then(async res => {
        if (!res.ok) {
          throw new Error(`Profile fetch failed: ${res.status}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : { success: false };
      })
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          setNickname(data.user.displayName || '');
          setEmail(data.user.email || '');
        }
      })
      .catch(err => {
        console.error('Settings Profile Error:', err);
        setStatus({ type: 'error', msg: 'Session expired or profile unavailable.' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: nickname, email }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus({ type: 'success', msg: 'Profile updated successfully!' });
      } else {
        setStatus({ type: 'error', msg: data.error || 'Failed to update profile.' });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'Sync error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20 mb-20 lg:mb-0">
        <div className="flex flex-col gap-2 mb-12 text-center sm:text-left">
           <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight italic">Heritage Settings</h1>
           <p className="text-muted-foreground">Customize your global identity and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Links */}
           <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scroll-hide">
              <SettingTab icon={<User size={18}/>} label="Identity" active />
              <SettingTab icon={<Shield size={18}/>} label="Privacy" disabled />
              <SettingTab icon={<Bell size={18}/>} label="Alerts" disabled />
              <SettingTab icon={<CreditCard size={18}/>} label="Wallet" disabled />
           </div>

           {/* Main Content */}
           <div className="lg:col-span-3 space-y-8">
              <FadeInItem>
                 <form onSubmit={handleSave} className="glass-premium-thick rounded-[2.5rem] p-8 sm:p-12 border border-white/5 space-y-10">
                    <div className="space-y-6">
                       <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                          <User className="text-primary" size={20} />
                          Global Nickname
                       </h2>
                       <div className="space-y-2">
                          <input 
                             type="text" 
                             value={nickname}
                             onChange={(e) => setNickname(e.target.value)}
                             placeholder="Enter your hero name..."
                             className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all placeholder:text-white/20"
                          />
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest px-2 italic">
                             This name will appear on the global rankings.
                          </p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                          <Bell className="text-primary" size={20} />
                          Private Email
                       </h2>
                       <div className="space-y-2">
                          <input 
                             type="email" 
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             placeholder="notifications@arena.tech"
                             className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all placeholder:text-white/20"
                          />
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest px-2 italic">
                             Used for important prize pool notifications.
                          </p>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                       {status && (
                          <div className={`flex items-center gap-2 py-2 px-4 rounded-xl border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                             {status.type === 'success' && <CheckCircle2 size={16} />}
                             <span className="text-xs font-bold uppercase tracking-wider">{status.msg}</span>
                          </div>
                       )}

                       <button 
                          type="submit"
                          disabled={saving}
                          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
                       >
                          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                          Save Changes
                       </button>
                    </div>
                 </form>
              </FadeInItem>

              <FadeInItem delay={0.2}>
                 <div className="p-8 bg-black/20 border border-white/5 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="text-sm font-bold text-white uppercase italic">Wallet Connection</h3>
                       <p className="text-xs text-muted-foreground font-mono">{user?.walletAddress}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                       Authenticated
                    </div>
                 </div>
              </FadeInItem>
           </div>
        </div>
      </div>
    </PageTransition>
  );
}

function SettingTab({ icon, label, active, disabled }: { icon: React.ReactNode, label: string, active?: boolean, disabled?: boolean }) {
  return (
    <button 
      disabled={disabled}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all whitespace-nowrap ${
        active 
          ? 'bg-primary/10 border-primary/20 text-primary font-bold' 
          : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 disabled:opacity-30'
      }`}
    >
      {icon}
      <span className="text-sm uppercase tracking-wider">{label}</span>
      {disabled && <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded ml-auto">SOON</span>}
    </button>
  );
}
