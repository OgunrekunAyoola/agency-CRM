import { vi } from 'vitest'

// Mocking useAuth BEFORE imports that might use it
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './page'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuth } from '@/hooks/useAuth'

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation: not loading, no user
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      user: null,
      loading: false,
      isAuthenticated: false,
    })
  })

  it('renders login form correctly', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('calls login function on form submission', async () => {
    const mockLogin = vi.fn().mockResolvedValue({})
    vi.mocked(useAuth).mockReturnValue({ 
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      user: null,
      loading: false,
      isAuthenticated: false,
    })

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('displays error message on failed login', async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid email or password'))
    vi.mocked(useAuth).mockReturnValue({ 
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      user: null,
      loading: false,
      isAuthenticated: false,
    })

    render(<LoginPage />)

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    expect(await screen.findByText(/Invalid email or password/i)).toBeInTheDocument()
  })
})
