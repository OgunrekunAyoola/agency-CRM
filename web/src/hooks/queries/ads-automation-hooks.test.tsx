import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAdAccounts } from './useAdAccounts'
import { useAdMetrics } from './useAdMetrics'
import { useAutomation } from './useAutomation'
import { vi, describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8000/api'

const handlers = [
  http.get(`${API_URL}/projects/P1/adaccounts`, () => HttpResponse.json([{ id: 'A1', platform: 0, name: 'FB Ads' }])),
  http.get(`${API_URL}/admetrics/analytics`, () => HttpResponse.json({ totalSpend: 1000, totalImpressions: 50000 })),
  // Backend endpoint is run-monthly-billing (not the old /trigger stub)
  http.post(`${API_URL}/automation/run-monthly-billing`, () => HttpResponse.json({ message: 'Monthly Billing Job triggered manually' })),
  http.post(`${API_URL}/automation/sync-ad-metrics`, () => HttpResponse.json({ message: 'Ad metrics sync triggered' })),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
})
afterAll(() => server.close())

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    })
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('Ads & Automation Hooks', () => {
    it('useAdAccounts fetches successfully', async () => {
        const { result } = renderHook(() => useAdAccounts('P1'), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(result.current.accounts).toHaveLength(1)
    })

    it('useAdMetrics fetches analytics successfully', async () => {
        const { result } = renderHook(() => useAdMetrics(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isAnalyticsLoading).toBe(false))
        expect(result.current.analytics?.totalSpend).toBe(1000)
    })

    it('useAutomation runMonthlyBilling triggers successfully', async () => {
        const { result } = renderHook(() => useAutomation(), { wrapper: createWrapper() })
        // runMonthlyBilling replaces the old triggerOverdueCheck
        const response = await result.current.runMonthlyBilling()
        expect(response.message).toContain('Monthly Billing')
    })

    it('useAutomation syncAdMetrics triggers for a project', async () => {
        const { result } = renderHook(() => useAutomation(), { wrapper: createWrapper() })
        const response = await result.current.syncAdMetrics('project-123')
        expect(response.message).toContain('sync triggered')
    })
})
