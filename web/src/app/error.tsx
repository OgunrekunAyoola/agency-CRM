'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error('CRITICAL FRONTEND ERROR:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-8 border border-rose-100 animate-pulse">
        <svg className="w-12 h-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
        Something went wrong
      </h1>
      
      <p className="max-w-md text-slate-500 mb-10 leading-relaxed">
        We encountered an unexpected error. Don&apos;t worry, your data hasn&apos;t been lost. 
        Please try refreshing the page.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          size="lg" 
          onClick={() => reset()}
          className="px-8 shadow-lg shadow-indigo-100"
        >
          Try Again
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => window.location.href = '/dashboard'}
          className="px-8"
        >
          Go to Dashboard
        </Button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-6 bg-slate-100 rounded-xl text-left max-w-2xl w-full overflow-auto border border-slate-200 shadow-inner">
          <p className="text-xs font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest">Debug Info (Dev Only)</p>
          <p className="text-sm font-mono text-rose-600 font-semibold break-words bg-white/50 p-3 rounded border border-rose-100">
            {error.message || "Unknown error"}
          </p>
          {error.stack && (
             <pre className="mt-4 text-[10px] font-mono text-slate-400 leading-tight">
               {error.stack.slice(0, 500)}...
             </pre>
          )}
        </div>
      )}
    </div>
  );
}
