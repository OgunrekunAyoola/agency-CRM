import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Mock environment variables for consistent API behavior in tests
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000'

// Mock next/navigation to avoid Router context errors
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}))

afterEach(() => {
  cleanup()
})
