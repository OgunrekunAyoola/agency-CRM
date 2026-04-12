import { render, screen } from '@testing-library/react'
import DashboardPage from './dashboard/page'
import LeadsPage from './leads/page'
import OffersPage from './offers/page'
import ProjectsPage from './projects/page'
import InvoicesPage from './invoices/page'
import { vi, describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/hooks/useAuth'
import React from 'react'

// Mock all necessary hooks
vi.mock('@/hooks/queries/useStats', () => ({ useStats: () => ({ data: { totalProjectsCount: 5, totalClientsCount: 10, totalLeadsCount: 3, totalOffersCount: 2 }, isLoading: false }) }))
vi.mock('@/hooks/queries/useInvoices', () => ({ useInvoices: () => ({ invoices: [], isLoading: false }), InvoiceStatus: { Paid: 3 } }))
vi.mock('@/hooks/queries/useAdMetrics', () => ({ useAdMetrics: () => ({ metrics: [], analytics: {}, isLoading: false }) }))
vi.mock('@/hooks/queries/useLeads', () => ({ useLeads: () => ({ leads: [], isLoading: false }), LeadStatus: {}, LeadSource: {}, ServiceType: {}, PipelineStage: {} }))
vi.mock('@/hooks/queries/useOffers', () => ({ useOffers: () => ({ offers: [], isLoading: false }) }))
vi.mock('@/hooks/queries/useProjects', () => ({ useProjects: () => ({ projects: [], isLoading: false }) }))
vi.mock('@/hooks/queries/useContracts', () => ({ useContracts: () => ({ contracts: [], isLoading: false }) }))
vi.mock('@/hooks/queries/useClients', () => ({ useClients: () => ({ clients: [], isLoading: false }), PriorityTier: {} }))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    )
}

describe('Main Feature Pages', () => {
    const Wrapper = createWrapper()

    it('Dashboard renders correctly', () => {
        render(<DashboardPage />, { wrapper: Wrapper })
        expect(screen.getByText(/Performance/i)).toBeInTheDocument()
    })

    it('Leads Page renders correctly', () => {
        render(<LeadsPage />, { wrapper: Wrapper })
        expect(screen.getByText(/Management/i)).toBeInTheDocument()
    })

    it('Offers Page renders correctly', () => {
        render(<OffersPage />, { wrapper: Wrapper })
        expect(screen.getByText(/Offers/i)).toBeInTheDocument()
    })

    it('Projects Page renders correctly', () => {
        render(<ProjectsPage />, { wrapper: Wrapper })
        expect(screen.getByText(/Projects/i)).toBeInTheDocument()
    })
})
