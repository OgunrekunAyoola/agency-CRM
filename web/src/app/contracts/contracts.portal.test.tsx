import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import * as apiModule from '@/lib/api';

// ── Contracts Page Tests ───────────────────────────────────────────────────────
// We test only what matters: portal token visibility, copy link presence,
// and the PortalStatusBadge rendering different states.

const mockContracts = [
  {
    id: '1',
    title: 'SEO Retainer',
    totalAmount: 5000,
    status: 0, // Draft
    projectId: 'p1',
    version: 1,
    signatureStatus: 'Not Sent',
    isWaitingSignature: false,
    baseRetainer: 1000,
    successFeeType: 0,
    successFeeValue: 0,
    createdAt: new Date().toISOString(),
    token: 'abc-123-token',
    hasBeenViewed: false,
  },
  {
    id: '2',
    title: 'Ads Campaign',
    totalAmount: 8000,
    status: 1, // Sent
    projectId: 'p2',
    version: 1,
    signatureStatus: 'Not Sent',
    isWaitingSignature: true,
    baseRetainer: 2000,
    successFeeType: 0,
    successFeeValue: 0,
    createdAt: new Date().toISOString(),
    token: 'def-456-token',
    hasBeenViewed: true,
  },
  {
    id: '3',
    title: 'Signed Deal',
    totalAmount: 12000,
    status: 2, // Signed
    projectId: 'p3',
    version: 1,
    signatureStatus: 'Signed',
    isWaitingSignature: false,
    signedAt: new Date().toISOString(),
    baseRetainer: 3000,
    successFeeType: 0,
    successFeeValue: 0,
    createdAt: new Date().toISOString(),
    token: 'ghi-789-token',
    hasBeenViewed: true,
  },
];

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('Contracts page — Portal column', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(apiModule.api, 'get').mockImplementation((url: string) => {
      if (url === '/api/contracts') return Promise.resolve(mockContracts);
      if (url === '/api/projects') return Promise.resolve([{ id: 'p1', name: 'Project A' }]);
      if (url === '/api/invoices') return Promise.resolve([]);
      return Promise.reject(new Error(`Unexpected: ${url}`));
    });
  });

  it('renders "Not Viewed" badge for contract with hasBeenViewed=false', async () => {
    const { default: ContractsPage } = await import('@/app/contracts/page');
    const Wrapper = createWrapper();
    render(<Wrapper><ContractsPage /></Wrapper>);

    await waitFor(() => {
      expect(screen.getByText('Not Viewed')).toBeInTheDocument();
    });
  });

  it('renders "Viewed" badge for contract with hasBeenViewed=true and not yet signed', async () => {
    const { default: ContractsPage } = await import('@/app/contracts/page');
    const Wrapper = createWrapper();
    render(<Wrapper><ContractsPage /></Wrapper>);

    await waitFor(() => {
      expect(screen.getByText('Viewed')).toBeInTheDocument();
    });
  });

  it('renders "Signed" badge for signed contract', async () => {
    const { default: ContractsPage } = await import('@/app/contracts/page');
    const Wrapper = createWrapper();
    render(<Wrapper><ContractsPage /></Wrapper>);

    await waitFor(() => {
      expect(screen.getAllByText('Signed').length).toBeGreaterThan(0);
    });
  });

  it('renders Copy Link buttons for each contract with a token', async () => {
    const { default: ContractsPage } = await import('@/app/contracts/page');
    const Wrapper = createWrapper();
    render(<Wrapper><ContractsPage /></Wrapper>);

    await waitFor(() => {
      const copyLinks = screen.getAllByText('Copy Link');
      expect(copyLinks.length).toBe(mockContracts.filter(c => c.token).length);
    });
  });

  it('copies portal URL to clipboard when Copy Link is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
    });

    const { default: ContractsPage } = await import('@/app/contracts/page');
    const Wrapper = createWrapper();
    render(<Wrapper><ContractsPage /></Wrapper>);

    await waitFor(() => screen.getAllByText('Copy Link'));
    const [firstCopyBtn] = screen.getAllByText('Copy Link');
    fireEvent.click(firstCopyBtn);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        expect.stringContaining('/portal/abc-123-token')
      );
    });
  });

  it('shows fallback error toast when clipboard.writeText fails', async () => {
    // Mock clipboard failure
    const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
    });
    
    // Spy on toast.error
    const { toast } = await import('sonner');
    const toastSpy = vi.spyOn(toast, 'error');

    const { default: ContractsPage } = await import('@/app/contracts/page');
    const Wrapper = createWrapper();
    render(<Wrapper><ContractsPage /></Wrapper>);

    await waitFor(() => screen.getAllByText('Copy Link'));
    const [firstCopyBtn] = screen.getAllByText('Copy Link');
    fireEvent.click(firstCopyBtn);

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledWith(
        expect.stringContaining('Could not copy automatically. Please copy this URL manually'),
        expect.any(Object)
      );
    });
  });
});
