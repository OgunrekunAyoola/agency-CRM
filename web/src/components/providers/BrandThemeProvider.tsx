'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function BrandThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.brandColor) {
      document.documentElement.style.setProperty('--brand-primary', user.brandColor);
      // Generate a slightly transparent version for hover states/bg
      document.documentElement.style.setProperty('--brand-primary-light', `${user.brandColor}20`);
    } else {
      // Default fallback
      document.documentElement.style.setProperty('--brand-primary', '#6366f1');
      document.documentElement.style.setProperty('--brand-primary-light', '#6366f120');
    }
  }, [user?.brandColor]);

  return <>{children}</>;
}
