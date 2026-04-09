'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  tenantId?: string;
  isOnboardingCompleted: boolean;
  avatarUrl?: string;
  jobTitle?: string;
  phoneNumber?: string;
  hourlyRate?: number;
  brandColor?: string;
  logoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; fullName: string; agencyName: string; password: string }) => Promise<void>;
  completeOnboarding: (data: unknown) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function restoreSession() {
      try {
        const data = await api.get<User>('/api/auth/me');
        setUser(data);
      } catch {
        // Silently fail if not logged in or token expired
        console.log('Restoration failed or no active session.');
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post<User>('/api/auth/login', { email, password });
    setUser(data);
    if (!data.isOnboardingCompleted) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  const register = async (data: { email: string; fullName: string; agencyName: string; password: string }) => {
    await api.post<User>('/api/auth/register', data);
    // After registration, we don't have cookies yet unless the API returns tokens or we log in
    // For this flow, let's assume they need to log in or we auto-login
    await login(data.email, data.password);
  };

  const completeOnboarding = async (data: unknown) => {
    await api.post('/api/auth/onboarding/complete', data);
    if (user) {
      setUser({ ...user, isOnboardingCompleted: true });
    }
    router.push('/dashboard');
  };

  const logout = async () => {
    await api.post('/api/auth/logout', {});
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, completeOnboarding, logout }}>
      {children}
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
