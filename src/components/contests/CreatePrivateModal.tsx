'use client';

import React, { useState, useEffect } from 'react';
import { X, Trophy, Shield, Rocket, Loader2, CheckCircle2 } from 'lucide-react';
import { locales } from '@/lib/locales';
import { useAuthStore } from '@/store/useAuthStore';

interface ContestTemplate {
  id: string;
  name: string;
  slug: string;
  startDate: string;
}

interface CreatePrivateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePrivateModal({ isOpen, onClose }: CreatePrivateModalProps) {
  const { locale } = useAuthStore();
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<ContestTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/contests/templates')
        .then(res => res.json())
        .then(data => setTemplates(data.templates || []))
        .catch(err => console.error('Fetch templates failed', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleCreate = async () => {
    if (!selectedTemplate || !companyName) return;
    setCreating(true);
    try {
      const res = await fetch('/api/contests/create-private', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          customName: companyName,
          customLogoUrl: logoUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.contest);
      } else {
        alert(data.error || 'Failed to create league');
      }
    } catch (err) {
      alert('Internal Server Error');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl glass-strong rounded-[2.5rem] border border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
           <div 
             className="h-full bg-primary transition-all duration-500" 
             style={{ width: `${(step / 3) * 100}%` }} 
           />
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 pt-16">
          {success ? (
            <div className="text-center py-10 animate-in zoom-in-95 duration-300">
               <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
               </div>
               <h3 className="text-3xl font-black text-white mb-2">League Created!</h3>
               <p className="text-muted-foreground mb-10">Your private corporate league is live. Start inviting your team.</p>
               
               <div className="p-6 rounded-3xl bg-white/5 border border-white/10 mb-10 text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Invite Code</div>
                  <div className="text-2xl font-mono font-black tracking-[0.3em] text-white">{success.inviteCode}</div>
               </div>

               <button 
                 onClick={() => window.location.href = `/contests/${success.slug}`}
                 className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:glow-green transition-all"
               >
                  Enter Battle Station
               </button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                   <h2 className="text-3xl font-black text-white mb-2">Select Battle Template</h2>
                   <p className="text-muted-foreground mb-8">Choose a professional league matchday to clone for your team.</p>
                   
                   {loading ? (
                     <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                   ) : (
                     <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {templates.map(t => (
                          <div 
                            key={t.id} 
                            onClick={() => setSelectedTemplate(t.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedTemplate === t.id ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(0,230,118,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                          >
                             <div className="flex items-center justify-between">
                                <div className="font-bold text-white">{t.name}</div>
                                <div className="text-[10px] text-muted-foreground">{new Date(t.startDate).toLocaleDateString()}</div>
                             </div>
                          </div>
                        ))}
                        {templates.length === 0 && <p className="text-center py-10 text-muted-foreground italic">No eligible templates found. Please check back later.</p>}
                     </div>
                   )}

                   <div className="mt-10 flex gap-4">
                      <button 
                        disabled={!selectedTemplate}
                        onClick={() => setStep(2)}
                        className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:glow-green transition-all disabled:opacity-50 disabled:grayscale"
                      >
                         Next Step
                      </button>
                   </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                   <h2 className="text-3xl font-black text-white mb-2">Corporate Identity</h2>
                   <p className="text-muted-foreground mb-8">Provide your company or team name and an optional branding logo.</p>
                   
                   <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Company Name</label>
                        <input 
                          type="text" 
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Acme Tech Corp"
                          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-bold outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Branding Logo URL (Optional)</label>
                        <input 
                          type="text" 
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          placeholder="https://company.com/logo.png"
                          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-medium text-xs outline-none focus:border-primary transition-all"
                        />
                      </div>
                   </div>

                   <div className="mt-12 flex gap-4">
                      <button onClick={() => setStep(1)} className="px-8 h-14 rounded-2xl bg-white/5 text-white font-bold text-xs uppercase">Back</button>
                      <button 
                        disabled={!companyName || creating}
                        onClick={handleCreate}
                        className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:glow-green transition-all disabled:opacity-50"
                      >
                         {creating ? <Loader2 className="mx-auto animate-spin" /> : 'Launch League'}
                      </button>
                   </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
