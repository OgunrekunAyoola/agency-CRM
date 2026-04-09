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
    const body = (await request.json()) as Record<string, unknown>
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
      { id: '1', title: 'Mock Lead 1', status: 0, companyName: 'Mock Company', contactName: 'John Lead', email: 'lead@example.com', source: 0, interest: 0, dealValue: 5000, probability: 50, createdAt: new Date().toISOString() },
    ])
  }),

  http.patch(`${API_URL}/leads/:id`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: '1', ...body });
  }),

  // Invoices
  http.get(`${API_URL}/invoices`, () => {
    return HttpResponse.json([
      { id: '1', invoiceNumber: 'INV-001', status: 1, totalAmount: 1200, dueDate: new Date().toISOString(), createdAt: new Date().toISOString() }
    ])
  }),

  http.post(`${API_URL}/invoices/:id/pay`, async () => {
    return HttpResponse.json({ success: true });
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
    const body = (await request.json()) as Record<string, unknown>
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

  // Projects & Tasks
  http.get(`${API_URL}/projects`, () => {
    return HttpResponse.json([
      { id: '1', name: 'Mock Project 1', status: 'Active', createdAt: new Date().toISOString() }
    ])
  }),

  http.get(`${API_URL}/tasks`, () => {
    return HttpResponse.json([
      { id: '1', title: 'Mock Task 1', status: 'ToDo', priority: 'High', createdAt: new Date().toISOString() }
    ])
  }),

  http.get(`${API_URL}/timeentries/project/:id`, () => {
    return HttpResponse.json([
      { id: '1', description: 'Working on stuff', durationMinutes: 60, entryDate: new Date().toISOString() }
    ])
  }),

  // Offers & Contracts
  http.get(`${API_URL}/offers`, () => {
    return HttpResponse.json([
      { id: '1', title: 'Mock Offer 1', status: 0, totalAmount: 5000, createdAt: new Date().toISOString() }
    ])
  }),

  http.get(`${API_URL}/contracts`, () => {
    return HttpResponse.json([
      { id: '1', title: 'Mock Contract 1', status: 0, value: 5000, createdAt: new Date().toISOString() }
    ])
  }),

  http.post(`${API_URL}/contracts/:id/sign`, async () => {
    return HttpResponse.json({ success: true });
  }),

  // Stats & Analytics
  http.get(`${API_URL}/stats`, () => {
    return HttpResponse.json({
      clients: 2,
      leads: 1,
      offers: 1,
      projects: 1
    })
  }),

  http.get(`${API_URL}/adaccounts`, () => {
    return HttpResponse.json([
      { id: 'acc_1', name: 'Mock Ad Account', platform: 'Google' }
    ])
  }),

  http.get(`${API_URL}/admetrics`, () => {
    return HttpResponse.json([
      { id: '1', date: new Date().toISOString(), spend: 500, impressions: 10000, clicks: 500, conversions: 10 }
    ])
  }),

  // Automation
  http.post(`${API_URL}/automation/trigger`, async () => {
    return HttpResponse.json({ success: true });
  })
]
