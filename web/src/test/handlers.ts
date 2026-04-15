import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8000/api'

export const handlers = [
  // Clients
  http.get(`${API_URL}/clients`, () => {
    return HttpResponse.json([
      { id: '1', name: 'Mock Client 1', email: 'v1@example.com' },
      { id: '2', name: 'Mock Client 2', email: 'v2@example.com' },
    ])
  }),

  http.post(`${API_URL}/clients`, async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({ id: '3', name: body.name }, { status: 201 })
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
      id: '1', email: 'admin@example.com', fullName: 'Admin User', role: 'Admin'
    })
  }),

  // Stats
  http.get(`${API_URL}/stats`, () => {
    return HttpResponse.json({
      totalRevenue: 50000,
      totalAdSpend: 12000,
      activeProjectsCount: 5,
      totalClientsCount: 10,
      activeLeadsCount: 15,
      pendingOffersCount: 3,
    })
  }),

  // Settings
  http.get(`${API_URL}/settings/organization`, () => {
    return HttpResponse.json({
      name: 'Mock Agency',
      taxId: 'VAT123',
      address: '123 Mock St',
      billingEmail: 'billing@mock.com',
      currency: 'USD',
      autoInvoice: true,
    })
  }),

  // Ad Metrics
  http.get(`${API_URL}/ad-metrics`, () => {
    return HttpResponse.json([
      { id: '1', platform: 'Google', spend: 500, clicks: 100, impressions: 5000, date: new Date().toISOString() }
    ])
  }),

  // Contracts
  http.get(`${API_URL}/contracts`, () => {
    return HttpResponse.json([
      { id: '1', title: 'Mock Contract 1', status: 0, totalAmount: 1000, projectId: '1', createdAt: new Date().toISOString() }
    ])
  }),

  // Projects
  http.get(`${API_URL}/projects`, () => {
    return HttpResponse.json([
      { id: '1', name: 'Mock Project 1', clientId: '1', createdAt: new Date().toISOString() }
    ])
  }),

  // Offers
  http.get(`${API_URL}/offers`, () => {
    return HttpResponse.json([
      { id: '1', title: 'Mock Offer 1', status: 0, dealValue: 5000, createdAt: new Date().toISOString() }
    ])
  })
]
