import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { useStats } from '@/hooks/queries/useStats';
import * as apiModule from '@/lib/api';

// ── Wrapper ────────────────────────────────────────────────────────────────────
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('useStats hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls /api/stats (not multiple list endpoints)', async () => {
    const mockStats = {
      totalRevenue: 5000,
      totalAdSpend: 200,
      activeProjectsCount: 3,
      totalClientsCount: 10,
      activeLeadsCount: 7,
      pendingOffersCount: 2,
    };
    const getSpy = vi.spyOn(apiModule.api, 'get').mockResolvedValue(mockStats);

    const { result } = renderHook(() => useStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Must call exactly ONE endpoint
    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith('/api/stats');
  });

  it('returns data with correct shape from /api/stats response', async () => {
    const mockStats = {
      totalRevenue: 12345.67,
      totalAdSpend: 999,
      activeProjectsCount: 5,
      totalClientsCount: 20,
      activeLeadsCount: 8,
      pendingOffersCount: 3,
    };
    vi.spyOn(apiModule.api, 'get').mockResolvedValue(mockStats);

    const { result } = renderHook(() => useStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockStats);
    expect(result.current.data?.activeProjectsCount).toBe(5);
    expect(result.current.data?.totalClientsCount).toBe(20);
  });

  it('exposes error state when /api/stats returns an error', async () => {
    vi.spyOn(apiModule.api, 'get').mockRejectedValue(new Error('API error: 503'));

    const { result } = renderHook(() => useStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
