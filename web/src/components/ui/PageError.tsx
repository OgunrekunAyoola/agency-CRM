'use client';

import { Button } from './Button';

export enum ErrorType {
  AUTH = 'auth',
  NOT_FOUND = 'not_found',
  NETWORK = 'network',
  SERVER = 'server',
  GENERIC = 'generic'
}

interface PageErrorProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  type = ErrorType.GENERIC,
  title,
  message,
  onRetry,
}: PageErrorProps) {
  
  const getErrorConfig = () => {
    switch (type) {
      case ErrorType.AUTH:
        return {
          icon: (
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          bgColor: 'bg-rose-50',
          defTitle: 'Authentication Required',
          defMessage: 'Your session has expired or you do not have permission to view this page.',
          suggestion: 'Try logging out and logging back in.'
        };
      case ErrorType.NETWORK:
        return {
          icon: (
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          ),
          bgColor: 'bg-amber-50',
          defTitle: 'Connection Error',
          defMessage: 'We are having trouble reaching our servers. Please check your internet connection.',
          suggestion: 'Check your Wi-Fi or local network status.'
        };
      case ErrorType.NOT_FOUND:
        return {
          icon: (
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgColor: 'bg-indigo-50',
          defTitle: 'Data Not Found',
          defMessage: 'The resource you requested does not exist or may have been deleted.',
          suggestion: 'Navigate back to the main dashboard.'
        };
      default:
        return {
          icon: (
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          bgColor: 'bg-amber-50',
          defTitle: 'Something went wrong',
          defMessage: 'An unexpected error occurred while processing your request.',
          suggestion: 'Try reloading the page or contacting support if the problem persists.'
        };
    }
  };

  const config = getErrorConfig();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`w-20 h-20 ${config.bgColor} rounded-3xl flex items-center justify-center mb-6 shadow-sm`}>
        {config.icon}
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {title || config.defTitle}
      </h3>
      
      <p className="text-sm text-slate-500 mb-2 max-w-sm">
        {message || config.defMessage}
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 mb-8 inline-flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested Fix:</span>
        <span className="text-xs font-semibold text-slate-600">{config.suggestion}</span>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          className="px-6 shadow-lg shadow-indigo-100 min-w-[140px]"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
