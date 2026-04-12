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
        const data = await api.get<User>('/api/auth/me');
        setUser(data);
      } catch {
        // Silently fail — no active session or token expired
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post<User>('/api/auth/login', { email, password });
    setUser(data);
    router.push('/dashboard');
  };

  const register = async (email: string, password: string, fullName: string, agencyName: string) => {
    const data = await api.post<User>('/api/auth/register', { email, password, fullName, agencyName });
    setUser(data);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout', {});
    } catch {
      // Still clear local state even if the server call fails
    } finally {
      setUser(null);
      // Clear all React Query cached data to prevent stale data leaking between sessions
      queryClient.clear();
      router.push('/login');
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
