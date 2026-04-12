'use client';

import React, { useEffect, useState } from 'react';
import { signals } from '@/lib/signals';
import { SessionExpiredState, AccessDeniedState, ErrorState } from './StateVisuals';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function FailsafeProvider({ children }: { children: React.ReactNode }) {
  const [signal, setSignal] = useState<'401' | '403' | '500' | null>(null);
  const pathname = usePathname();

  // Reset signals when navigating to a new page
  useEffect(() => {
    setSignal(null);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = signals.subscribe((type) => {
      setSignal(type);
    });
    return () => { unsubscribe(); };
  }, []);

  if (signal === '401') {
    return (
      <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card border shadow-2xl rounded-2xl max-w-lg w-full">
          <SessionExpiredState />
        </div>
      </div>
    );
  }

  if (signal === '403') {
    return <AccessDeniedState />;
  }

  if (signal === '500') {
    return <ErrorState reset={() => setSignal(null)} />;
  }

  return <>{children}</>;
}

/**
 * Full-screen loading overlay to prevent flicker during session restoration.
 */
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[110] bg-background flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
      <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
        <span className="text-white font-bold text-2xl">A</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <Loader2 className="h-4 w-4 animate-spin" />
        Authenticating...
      </div>
    </div>
  );
}
