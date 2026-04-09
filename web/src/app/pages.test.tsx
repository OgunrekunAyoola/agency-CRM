import { render, screen } from '@testing-library/react'
import DashboardPage from './dashboard/page'
import LeadsPage from './leads/page'
import OffersPage from './offers/page'
import ProjectsPage from './projects/page'
import InvoicesPage from './invoices/page'
import ContractsPage from './contracts/page'
import { vi, describe, it, expect } from 'vitest'

// Mock all necessary hooks
vi.mock('@/hooks/queries/useStats', () => ({ useStats: () => ({ data: { projects: 5, clients: 10, leads: 3, offers: 2 }, isLoading: false }) }))
vi.mock('@/hooks/queries/useInvoices', () => ({ useInvoices: () => ({ invoices: [], isLoading: false }), InvoiceStatus: { Paid: 3 } }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'U1', role: 'Admin' }, loading: false }) }))
vi.mock('@/hooks/queries/useAdMetrics', () => ({ useAdMetrics: () => ({ metrics: [], isLoading: false }) }))
vi.mock('@/hooks/queries/useLeads', () => ({ useLeads: () => ({ leads: [], isLoading: false }), LeadStatus: {}, LeadSource: {}, ServiceType: {}, PipelineStage: {} }))
vi.mock('@/hooks/queries/useOffers', () => ({ 
    useOffers: () => ({ offers: [], isLoading: false }),
    OfferStatus: { Draft: 0, Sent: 1, Accepted: 2, Rejected: 3 }
}))
vi.mock('@/hooks/queries/useProjects', () => ({ useProjects: () => ({ projects: [], isLoading: false }) }))
vi.mock('@/hooks/queries/useContracts', () => ({ useContracts: () => ({ contracts: [], isLoading: false }) }))
vi.mock('@/hooks/queries/useClients', () => ({ useClients: () => ({ clients: [], isLoading: false }), PriorityTier: {} }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn()
  }),
  usePathname: () => '/'
}))

describe('Main Feature Pages', () => {
    it('Dashboard renders correctly', () => {
        render(<DashboardPage />)
        expect(screen.getByText('Agency Performance')).toBeInTheDocument()
    })

    it('Leads Page renders correctly', () => {
        render(<LeadsPage />)
        expect(screen.getByRole('heading', { name: /Leads/i, level: 1 })).toBeInTheDocument()
    })

    it('Offers Page renders correctly', () => {
        render(<OffersPage />)
        expect(screen.getByRole('heading', { name: /Offers/i, level: 1 })).toBeInTheDocument()
    })

    it('Projects Page renders correctly', () => {
        render(<ProjectsPage />)
        expect(screen.getByRole('heading', { name: /Projects/i, level: 1 })).toBeInTheDocument()
    })

    it('Invoices Page renders correctly', () => {
        render(<InvoicesPage />)
        expect(screen.getByRole('heading', { name: /Invoices/i, level: 1 })).toBeInTheDocument()
    })
})
