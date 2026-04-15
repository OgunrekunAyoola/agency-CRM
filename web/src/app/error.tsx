'use client';

import { ErrorState } from '@/components/ui/StateVisuals';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState reset={reset} />;
}
