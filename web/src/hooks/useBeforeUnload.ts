import { useEffect } from 'react';

/**
 * Shows a browser "Leave page?" confirmation when the user tries to close or
 * navigate away while `isDirty` is true.
 *
 * Usage:
 *   const [isDirty, setIsDirty] = useState(false);
 *   useBeforeUnload(isDirty);
 *
 * Note: Modern browsers show their own generic message — the `message` param
 * is ignored by Chrome/Firefox/Safari for security reasons.
 */
export function useBeforeUnload(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Chrome requires returnValue to be set (legacy API)
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}
