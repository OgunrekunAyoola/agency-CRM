import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { apiRequest } from '../lib/api'

global.fetch = vi.fn()

describe('apiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle successful responses', async () => {
    const mockData = { id: 1, name: 'Test' }
    ;(fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    const result = await apiRequest('/test')
    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.any(Object))
  })

  it('should throw error on failure', async () => {
    ;(fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Server Error' }),
    })

    await expect(apiRequest('/fail')).rejects.toThrow('Server Error')
  })
})
