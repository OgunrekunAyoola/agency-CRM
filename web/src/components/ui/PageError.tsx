'use client';

interface PageErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  title = 'Something went wrong',
  message = 'We could not load this data. This may be a temporary issue.',
  onRetry,
}: PageErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-4">
      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
