import { create } from 'zustand';

interface User {
  walletAddress: string;
  displayName: string | null;
  avatarSeed: string | null;
  totalPoints: number;
  isAdmin: boolean;
  language?: string;
}

export type Locale = 'en' | 'es';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  locale: Locale;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (locale: Locale) => Promise<void>;
  setLoading: (loading: boolean) => void;
  fetchSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true, // starts loading to check session on mount
  locale: 'en',

  login: (user) => set({ isAuthenticated: true, user, locale: (user.language as Locale) || 'en' }),
  logout: () => set({ isAuthenticated: false, user: null }),
  
  setLanguage: async (locale: Locale) => {
    // Optimistic Update
    set({ locale });
    
    // Persist to backend if logged in
    const state = useAuthStore.getState();
    if (state.isAuthenticated && state.user) {
      try {
        await fetch('/api/user/language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: locale })
        });
      } catch (err) {
        console.error('Failed to persist language:', err);
      }
    }
  },
  setLoading: (loading) => set({ isLoading: loading }),
  
  fetchSession: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch('/api/auth/me');
      
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          set({ 
            isAuthenticated: true, 
            user: data.user, 
            locale: (data.user.language as Locale) || 'en' 
          });
        } else {
          set({ isAuthenticated: false, user: null });
        }
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error('Session fetch failed:', error);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
