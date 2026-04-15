import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import DashboardPageClient from '@/app/dashboard/DashboardPageClient';
import * as apiModule from '@/lib/api';

// Suppress Lucide / canvas errors in test env
vi.mock('@/app/dashboard/components/ROIAnalytics', () => ({
  ROIAnalytics: () => <div data-testid="roi-analytics" />,
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockStats = {
  totalRevenue: 0,
  totalAdSpend: 0,
  activeProjectsCount: 4,
  totalClientsCount: 12,
  activeLeadsCount: 3,
  pendingOffersCount: 6,
};

describe('DashboardPageClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(apiModule.api, 'get').mockImplementation((url: string) => {
      if (url === '/api/stats') return Promise.resolve(mockStats);
      if (url === '/api/invoices') return Promise.resolve([]);
      if (url === '/api/admetrics') return Promise.resolve([]);
      return Promise.reject(new Error(`Unexpected request to ${url}`));
    });
  });

  it('renders stat card values from /api/stats response', async () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DashboardPageClient />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument(); // activeProjectsCount
      expect(screen.getByText('12')).toBeInTheDocument(); // totalClientsCount
    });
  });

  it('renders "Something went wrong" error state when /api/stats fails', async () => {
    vi.spyOn(apiModule.api, 'get').mockImplementation((url: string) => {
      if (url === '/api/stats') return Promise.reject(new Error('Network error'));
      if (url === '/api/invoices') return Promise.resolve([]);
      if (url === '/api/admetrics') return Promise.resolve([]);
      return Promise.reject(new Error(`Unexpected request to ${url}`));
    });

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DashboardPageClient />
      </Wrapper>
    );

    // When stats fail, we show the ErrorState component
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Try Again/i).length).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });
});
