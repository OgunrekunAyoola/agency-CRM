import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8000/api'

export const handlers = [
  // Clients
  http.get(`${API_URL}/clients`, () => {
    return HttpResponse.json([
      { 
        id: '1', 
        name: 'Mock Client 1', 
        email: 'v1@example.com',
        legalName: 'Mock Client 1 LTD',
        vatNumber: 'GB123456789',
        businessAddress: '123 Mock St, London',
        industry: 'Tech',
        priority: 0,
        createdAt: new Date().toISOString()
      },
      { 
        id: '2', 
        name: 'Mock Client 2', 
        email: 'v2@example.com',
        legalName: 'Mock Client 2 LTD',
        vatNumber: 'GB987654321',
        businessAddress: '456 Mock Rd, Manchester',
        industry: 'Marketing',
        priority: 1,
        createdAt: new Date().toISOString()
      },
    ])
  }),

  http.post(`${API_URL}/clients`, async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({ 
      id: '3', 
      name: body.name,
      legalName: body.legalName || body.name,
      vatNumber: body.vatNumber || 'NEW-VAT',
      businessAddress: body.businessAddress || 'New Address',
      industry: body.industry || 'Other',
      priority: body.priority || 0,
      createdAt: new Date().toISOString()
    }, { status: 201 })
  }),

  // Leads
  http.get(`${API_URL}/leads`, () => {
    return HttpResponse.json([
      { id: '1', title: 'Mock Lead 1', status: 'New' },
    ])
  }),

  // Auth
  http.post(`${API_URL}/auth/login`, async () => {
    return HttpResponse.json({
      id: '1',
      email: 'admin@example.com',
      fullName: 'Admin User',
      role: 'Admin',
      isOnboardingCompleted: true
    })
  }),

  http.get(`${API_URL}/auth/me`, async () => {
    return HttpResponse.json({
      id: '1',
      email: 'admin@example.com',
      fullName: 'Admin User',
      role: 'Admin',
      isOnboardingCompleted: true
    })
  }),

  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      id: '2',
      email: body.email,
      fullName: body.fullName,
      role: 'Admin',
      isOnboardingCompleted: false
    }, { status: 201 })
  }),

  http.post(`${API_URL}/auth/onboarding/complete`, async () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.post(`${API_URL}/auth/logout`, async () => {
    return new HttpResponse(null, { status: 200 })
  }),

  // Projects
  http.get(`${API_URL}/projects`, () => {
    return HttpResponse.json([
      { id: '1', name: 'Mock Project 1' }
    ])
  }),

  // Offers
  http.get(`${API_URL}/offers`, () => {
    return HttpResponse.json([
      { id: '1', title: 'Mock Offer 1', status: 'Draft' }
    ])
  })
]
