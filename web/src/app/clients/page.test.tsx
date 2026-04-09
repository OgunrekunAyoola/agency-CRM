import { render, screen, fireEvent } from '@testing-library/react'
import ClientsPage from './page'
import { vi, describe, it, expect } from 'vitest'
import { useClients } from '@/hooks/queries/useClients'

vi.mock('@/hooks/queries/useClients', () => ({
  useClients: vi.fn(),
  PriorityTier: {
    Tier1: 0,
    Tier2: 1,
    Tier3: 2,
    0: 'Tier1 (High)',
    1: 'Tier2 (Medium)',
    2: 'Tier3 (Low)',
  },
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', role: 'Admin' },
    loading: false
  }),
}))

describe('ClientsPage Component', () => {
  const mockClients = [
    { id: '1', name: 'Zebra Corp', legalName: 'Zebra Solutions', industry: 'Tech', priority: 0, createdAt: '2024-01-01', vatNumber: 'VAT1', businessAddress: 'Address 1' },
    { id: '2', name: 'Alpha Inc', legalName: 'Alpha Ltd', industry: 'Finance', priority: 1, createdAt: '2024-01-02', vatNumber: 'VAT2', businessAddress: 'Address 2' },
  ]

  it('renders loading state correctly', () => {
    vi.mocked(useClients).mockReturnValue({ clients: [], isLoading: true, isError: false, refetch: vi.fn(), error: null, createClient: vi.fn(), isCreating: false })
    render(<ClientsPage />)

    // Animated pulses have bg-muted class
    const pulses = document.getElementsByClassName('animate-pulse');
    expect(pulses.length).toBeGreaterThan(0);
  })

  it('renders clients table correctly', () => {
    vi.mocked(useClients).mockReturnValue({ clients: mockClients, isLoading: false, isError: false, refetch: vi.fn(), error: null, createClient: vi.fn(), isCreating: false })
    render(<ClientsPage />)

    expect(screen.getByText('Zebra Corp')).toBeInTheDocument()
    expect(screen.getByText('Alpha Inc')).toBeInTheDocument()
  })

  it('opens modal on "Add Client" click', () => {
    vi.mocked(useClients).mockReturnValue({ clients: mockClients, isLoading: false, isError: false, refetch: vi.fn(), error: null, createClient: vi.fn(), isCreating: false })
    render(<ClientsPage />)

    fireEvent.click(screen.getByRole('button', { name: /Add Client/i }))
    expect(screen.getByText('Create New Client')).toBeInTheDocument()
  })

  it('sorts clients correctly by name', async () => {
    vi.mocked(useClients).mockReturnValue({ clients: mockClients, isLoading: false, isError: false, refetch: vi.fn(), error: null, createClient: vi.fn(), isCreating: false })
    render(<ClientsPage />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'name' } })

    const rows = screen.getAllByRole('row')
    // Header is row 0, Alpha should be row 1, Zebra row 2
    expect(rows[1]).toHaveTextContent('Alpha Inc')
    expect(rows[2]).toHaveTextContent('Zebra Corp')
  })
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn()
  }),
  usePathname: () => '/'
}))
