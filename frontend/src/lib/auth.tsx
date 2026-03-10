'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  year_of_study?: string;
  department?: string;
  referral_code: string;
  profile_completed: number;
  easter_eggs_found: string[];
  xp_points: number;
  profile_percent?: number;
  achievements_submitted?: number;
  referrals_count?: number;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, referral_code?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  discoverEasterEgg: (eggId: string) => Promise<{ newEgg: boolean; xpEarned: number } | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useOptionalAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set auth header when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('etech_token');
    if (stored) {
      setToken(stored);
      api.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
      // Fetch user profile
      api.get('/users/me')
        .then(r => setUser(r.data.data))
        .catch(() => {
          localStorage.removeItem('etech_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: u, token: t } = res.data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('etech_token', t);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, referral_code?: string) => {
    const res = await api.post('/auth/register', { name, email, password, referral_code });
    const { user: u, token: t } = res.data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('etech_token', t);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('etech_token');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get('/users/me');
      setUser(res.data.data);
    } catch { /* ignore */ }
  }, [token]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const res = await api.put('/users/me', data);
    setUser(prev => prev ? { ...prev, ...res.data.data } : null);
  }, []);

  const discoverEasterEgg = useCallback(async (eggId: string) => {
    if (!token) return null;
    // Check if already found
    if (user?.easter_eggs_found?.includes(eggId)) return null;
    try {
      const res = await api.post('/users/easter-egg', { egg_id: eggId });
      const data = res.data.data;
      if (data.new_egg) {
        setUser(prev => prev ? {
          ...prev,
          easter_eggs_found: data.eggs,
          xp_points: data.xp,
        } : null);
        return { newEgg: true, xpEarned: data.xp_earned };
      }
      return null;
    } catch {
      return null;
    }
  }, [token, user]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser, updateProfile, discoverEasterEgg }}>
      {children}
    </AuthContext.Provider>
  );
}
