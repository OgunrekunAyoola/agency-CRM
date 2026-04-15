'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LoadingOverlay } from '@/components/ui/FailsafeProvider';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  tenantId?: string;
  isOnboarded?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, agencyName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    async function restoreSession() {
      try {
        // Always attempt to restore via HttpOnly cookie (credentials: 'include').
        // Do NOT gate this on localStorage — the cookie and localStorage can get
        // out of sync, which causes an infinite middleware↔client redirect loop.
        const data = await api.get<User>('/api/auth/me');
        setUser(data);
      } catch {
        // Session invalid or expired — clear any stale localStorage token.
        localStorage.removeItem('access_token');
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post<any>('/api/auth/login', { email, password });

    // Fallback for cross-domain cookie blocking
    if (data.accessToken) {
      localStorage.setItem('access_token', data.accessToken);
    }

    setUser(data);
    // Use client-side navigation to avoid a full-page reload, which would
    // re-enter the middleware→restoreSession loop before cookies settle.
    router.push(data.isOnboarded === false ? '/onboarding' : '/dashboard');
  };

  const register = async (email: string, password: string, fullName: string, agencyName: string) => {
    const data = await api.post<User>('/api/auth/register', { email, password, fullName, agencyName });
    setUser(data);
    router.push('/onboarding');
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout', {});
    } catch {
      // Still clear local state
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
      queryClient.clear();
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {loading ? <LoadingOverlay /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
