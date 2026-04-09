import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './page'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useAuth } from '@/hooks/useAuth'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('LoginPage Component', () => {
  const mockLogin = vi.fn()
  const mockRegister = vi.fn()
  const mockLogout = vi.fn()
  const mockCompleteOnboarding = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      logout: mockLogout,
      completeOnboarding: mockCompleteOnboarding,
      user: null,
      loading: false
    })
  })

  it('renders login form correctly', () => {
    render(<LoginPage />)

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('calls login function on form submission', async () => {
    mockLogin.mockResolvedValue({})
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/Email/i), {
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
    mockLogin.mockRejectedValue({ 
      response: { data: { message: 'Invalid credentials' } } 
    })
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrong' } })
    
    // Use role for button to be sure
    const submitButton = screen.getByRole('button', { name: /Sign In/i })
    fireEvent.click(submitButton)
    
    // The component displays the error after the promise rejects
    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument()
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
