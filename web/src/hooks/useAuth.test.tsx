import { renderHook, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './useAuth'
import { vi, describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '../test/handlers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const server = setupServer(...handlers)

// Separate mock for router to ensure accessibility in tests
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
})
afterAll(() => server.close())

const createWrapper = () => {
    const queryClient = new QueryClient({ 
        defaultOptions: { queries: { retry: false } } 
    })
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    )
}

describe('useAuth Hook', () => {
  it('logs in successfully and updates user state', async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Wait for initial session restoration to finish (restoreSession in useEffect)
    await waitFor(() => expect(result.current.loading).toBe(false))

    // PERFORM LOGIN
    await act(async () => {
      await result.current.login('admin@example.com', 'Admin123!')
    })

    // VERIFY STATE
    expect(result.current.user).toEqual({
      id: '1',
      email: 'admin@example.com',
      fullName: 'Admin User',
      role: 'Admin',
    })
    
    // VERIFY REDIRECT
    await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('logs out successfully and clears user state', async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    // Login first
    await act(async () => {
      await result.current.login('admin@example.com', 'Admin123!')
    })

    // PERFORM LOGOUT
    await act(async () => {
      await result.current.logout()
    })

    // VERIFY STATE
    expect(result.current.user).toBeNull()
    
    // VERIFY REDIRECT
    await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })
})
