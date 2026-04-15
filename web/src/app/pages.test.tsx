import { render, screen } from '@testing-library/react'
import DashboardPage from './dashboard/page'
import LeadsPage from './leads/page'
import OffersPage from './offers/page'
import ProjectsPage from './projects/page'
import { vi, describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Mock useAuth so AuthProvider skips the async restoreSession effect
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false, isAuthenticated: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock all necessary hooks
vi.mock('@/hooks/queries/useStats', () => ({ useStats: () => ({ data: { totalProjectsCount: 5, totalClientsCount: 10, activeProjectsCount: 5, activeLeadsCount: 3, pendingOffersCount: 2 }, isLoading: false }) }))
vi.mock('@/hooks/queries/useInvoices', () => ({ useInvoices: () => ({ invoices: [], isLoading: false }), InvoiceStatus: { Paid: 3 } }))
vi.mock('@/hooks/queries/useAdMetrics', () => ({ useAdMetrics: () => ({ metrics: [], analytics: {}, isLoading: false }) }))
vi.mock('@/hooks/queries/useLeads', () => ({ useLeads: () => ({ leads: [], isLoading: false }), LeadStatus: {}, LeadSource: {}, ServiceType: {}, PipelineStage: {} }))
vi.mock('@/hooks/queries/useOffers', () => ({ useOffers: () => ({ offers: [], isLoading: false }), OfferStatus: { Draft: 0, Sent: 1, Accepted: 2, Rejected: 3 } }))
vi.mock('@/hooks/queries/useProjects', () => ({ useProjects: () => ({ projects: [], isLoading: false }) }))
vi.mock('@/hooks/queries/useContracts', () => ({ useContracts: () => ({ contracts: [], isLoading: false }) }))
vi.mock('@/hooks/queries/useClients', () => ({ useClients: () => ({ clients: [], isLoading: false }), PriorityTier: {} }))

// Mock complex sub-components that don't render cleanly in jsdom
vi.mock('@/app/dashboard/components/ROIAnalytics', () => ({ ROIAnalytics: () => null }))
vi.mock('@/components/dashboard/OnboardingChecklist', () => ({ OnboardingChecklist: () => null }))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('Main Feature Pages', () => {
    it('Dashboard renders correctly', () => {
        render(<DashboardPage />, { wrapper: createWrapper() })
        expect(screen.getByRole('heading', { name: /Agency Performance/i })).toBeInTheDocument()
    })

    it('Leads Page renders correctly', () => {
        render(<LeadsPage />, { wrapper: createWrapper() })
        expect(screen.getAllByRole('heading', { name: /Leads/i }).length).toBeGreaterThan(0)
    })

    it('Offers Page renders correctly', () => {
        render(<OffersPage />, { wrapper: createWrapper() })
        expect(screen.getAllByRole('heading', { name: /Offers/i }).length).toBeGreaterThan(0)
    })

    it('Projects Page renders correctly', () => {
        render(<ProjectsPage />, { wrapper: createWrapper() })
        expect(screen.getAllByRole('heading', { name: /Projects/i }).length).toBeGreaterThan(0)
    })
})
