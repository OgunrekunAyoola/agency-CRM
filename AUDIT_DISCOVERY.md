# MVP Readiness Audit — Discovery Report

> Generated: 2026-04-15  
> Auditor: Claude Sonnet 4.6  
> Scope: Full-stack (Next.js frontend + .NET 8 backend)

---

## 1. Frontend Routes (Next.js App Router)

| Route | File | Status |
|---|---|---|
| `/` | `app/page.tsx` | ⚠️ Public landing page — missing Login/Signup nav, no metadata export, no auth redirect |
| `/login` | `app/login/page.tsx` | ✅ Functional |
| `/register` | `app/register/page.tsx` | ⚠️ No confirm-password field, no password-strength validation |
| `/signup` | `app/signup/page.tsx` | ⚠️ Duplicate of /register — same gaps |
| `/forgot-password` | `app/forgot-password/page.tsx` | ✅ UI correct — backend is stubbed |
| `/reset-password/[token]` | `app/reset-password/[token]/page.tsx` | ⚠️ Error check reads raw message string ("400") — fragile; backend stub accepts any token |
| `/onboarding` | `app/onboarding/page.tsx` | ⚠️ Logo URL required to advance step 3 (should be optional); empty catch block swallows errors; calls `/api/auth/onboarding/complete` which does NOT exist |
| `/dashboard` | `app/dashboard/page.tsx` | ✅ |
| `/clients` | `app/clients/page.tsx` | ✅ |
| `/clients/[id]` | `app/clients/[id]/page.tsx` | ✅ |
| `/leads` | `app/leads/page.tsx` | ✅ |
| `/offers` | `app/offers/page.tsx` | ✅ |
| `/projects` | `app/projects/page.tsx` | ✅ |
| `/projects/[id]` | `app/projects/[id]/page.tsx` | ✅ |
| `/tasks` | `app/tasks/page.tsx` | ✅ |
| `/contracts` | `app/contracts/page.tsx` | ✅ |
| `/invoices` | `app/invoices/page.tsx` | ✅ |
| `/analytics` | `app/analytics/page.tsx` | ✅ |
| `/integrations` | `app/integrations/page.tsx` | ✅ |
| `/settings` | `app/settings/page.tsx` | ⚠️ No change-password section |
| `/settings/automation` | `app/settings/automation/page.tsx` | ✅ |
| `/portal/[token]` | `app/portal/[token]/page.tsx` | ✅ |

---

## 2. Backend API Endpoints

| Controller | Endpoint | Status |
|---|---|---|
| AuthController | `POST /api/auth/login` | ✅ |
| AuthController | `POST /api/auth/register` | ✅ |
| AuthController | `POST /api/auth/refresh` | ✅ |
| AuthController | `POST /api/auth/logout` | ✅ |
| AuthController | `GET /api/auth/me` | ✅ |
| AuthController | `POST /api/auth/forgot-password` | ❌ Stub — never generates token, never sends email |
| AuthController | `POST /api/auth/reset-password` | ❌ Stub — accepts any non-empty token |
| AuthController | `POST /api/auth/onboarding/complete` | ❌ MISSING — called by frontend but endpoint does not exist |
| AuthController | `POST /api/auth/change-password` | ❌ MISSING — no change-password flow anywhere |
| ClientsController | `GET/POST/GET{id}` | ✅ |
| LeadsController | `GET/POST/PATCH{id}/status/PUT{id}` | ✅ |
| OffersController | `GET/POST/PATCH{id}/status` | ✅ |
| ProjectsController | `GET /api/projects` | ✅ |
| ProjectsController | `POST /api/projects` | ✅ |
| ProjectsController | `GET /api/projects/{id}` | ❌ MISSING |
| ProjectsController | `PUT /api/projects/{id}` | ❌ MISSING |
| ProjectsController | `DELETE /api/projects/{id}` | ❌ MISSING |
| TasksController | `GET /api/tasks` | ✅ |
| TasksController | `POST /api/tasks` | ✅ |
| TasksController | `GET /api/tasks/{id}` | ❌ MISSING |
| TasksController | `PUT /api/tasks/{id}` | ❌ MISSING |
| TasksController | `DELETE /api/tasks/{id}` | ❌ MISSING |
| TasksController | `PATCH /api/tasks/{id}/status` | ❌ MISSING |
| ContractsController | `GET/POST/generate/sign` | ✅ |
| ContractPortalController | `GET/POST sign/view` | ✅ |
| InvoicesController | `GET/POST/generate/status/payments` | ✅ |
| SettingsController | `GET/PATCH /api/settings/organization` | ✅ |
| StatsController | `GET /api/stats` | ✅ |
| AutomationController | `POST run-monthly-billing / sync-ad-metrics` | ✅ |
| WebhooksController | `POST meta/google/tiktok` | ✅ (stubs) |

---

## 3. Domain Entities & Relationships

| Entity | Key Fields | Relationships |
|---|---|---|
| `Tenant` | Name, Industry, CompanySize, Website, LogoUrl, BrandColor, TargetMonthlyRevenue, BusinessAddress, OnboardingCompleted, BillingEmail, Currency, TaxId | → Users |
| `User` | Email, FullName, JobTitle, PhoneNumber, PasswordHash, Role (Admin/SalesManager/ProjectManager/Accountant), TenantId, HourlyRate | → Tenant, RefreshTokens, TimeEntries, ProjectMemberships |
| `Client` | Name, LegalName, VatNumber, BusinessAddress, Industry, Priority | → Contacts, Invoices, Contracts, Leads |
| `Lead` | Title, Description, ContactName, Email, Status, PipelineStage, DealValue, Source | → Owner(User), ConvertedClient, Offers |
| `Offer` | Title, TotalAmount, Status (Draft/Sent/Accepted/Rejected) | → Lead, OfferItems, Projects |
| `Project` | Name, Description, Status | → Client, Offer, Tasks, TimeEntries, Members, AdAccounts |
| `CrmTask` | Title, Description, Status, Priority, StartDate, DueDate | → Project, TimeEntries |
| `Contract` | Title, TotalAmount, Status, Terms, Kpis, PortalToken, SignatureData | → Client, Project, Invoices |
| `Invoice` | InvoiceNumber, TotalAmount, PaidAmount, Status | → Contract, Project, Client, InvoiceItems, Payments |
| `AdMetric` | (spend, impressions, clicks, conversions, date) | → Project |
| `RefreshToken` | Token, ExpiryDate, RevokedAt | → User |

**Missing from User entity**: `PasswordResetToken`, `PasswordResetTokenExpiry` — required for proper forgot/reset password implementation.

---

## 4. Authentication Files

### Frontend
- `web/src/hooks/useAuth.tsx` — Auth context (login, register, logout, completeOnboarding)
- `web/src/middleware.ts` — Route protection (**CRITICAL BUG**: `/register`, `/signup`, `/forgot-password`, `/reset-password` missing from PUBLIC_PATHS — unauthenticated users cannot reach these pages)
- `web/src/lib/api.ts` — Centralised API client with auto-refresh on 401

### Backend
- `backend/Crm.Api/Controllers/AuthController.cs` — Auth endpoints
- `backend/Crm.Application/Services/AuthService.cs` — Auth business logic
- `backend/Crm.Infrastructure/Security/CurrentUserContext.cs` — JWT claim extraction
- `backend/Crm.Api/Program.cs` — JWT Bearer config

---

## 5. Forms

| Page | Form Fields | Issues |
|---|---|---|
| `/login` | email, password | ✅ |
| `/register` | fullName, agencyName, email, password | ⚠️ No confirm password, no inline validation |
| `/signup` | agencyName, fullName, email, password | ⚠️ Same as /register |
| `/forgot-password` | email | ✅ |
| `/reset-password/[token]` | password, confirmPassword | ⚠️ No password strength validation |
| `/onboarding` | jobTitle, phoneNumber, industry, companySize, website, targetMonthlyRevenue, businessAddress, brandColor, logoUrl | ⚠️ logoUrl required to advance step 3 |
| `/clients` | name, legalName, vatNumber, businessAddress, industry, priority | ✅ |
| `/leads` | title, contactName, email, phone, companyName, description, source, interest | ✅ |
| `/offers` | title, items array, notes | ✅ |
| `/projects` | name, description, clientId | ✅ |
| `/tasks` | title, description, projectId, startDate, dueDate | ✅ |
| `/contracts` | title, totalAmount, projectId, terms, kpis, baseRetainer, successFee | ✅ |
| `/invoices` | payment: amount, date, method, reference | ✅ |
| `/settings` | name, taxId, billingEmail, address, currency, autoInvoice | ⚠️ No change-password section |
| `/portal/[token]` | signature pad | ✅ |

---

## 6. Stubbed / Incomplete Items

### CRITICAL (blocks functionality)
1. **`POST /api/auth/onboarding/complete`** — Missing endpoint. `useAuth.completeOnboarding()` calls it; 404 on every submit.
2. **Middleware public paths** — `/register`, `/signup`, `/forgot-password`, `/reset-password` block unauthenticated access. Users who are not logged in cannot sign up or recover their password.
3. **`AuthService.ForgotPasswordAsync`** — Stub: returns `true` without generating a token or sending an email.
4. **`AuthService.ResetPasswordAsync`** — Stub: accepts any non-empty string as a valid token.

### HIGH
5. **No change-password endpoint/UI** — `POST /api/auth/change-password` missing; no UI in settings.
6. **Projects CRUD** — GET/:id, PUT/:id, DELETE/:id missing.
7. **Tasks CRUD** — GET/:id, PUT/:id, DELETE/:id, PATCH/:id/status missing.
8. **Landing page** — Missing Login/Signup navigation, no `metadata` export, no auth redirect for authenticated users, CTAs link to authenticated routes.

### MEDIUM
9. **Register/Signup validation** — No confirm-password field; no password strength rule.
10. **Onboarding logo gating** — `disabled={!formData.logoUrl}` makes logo upload mandatory, but it's optional in the `OnboardingRequest` DTO.
11. **Onboarding error handling** — Empty `catch` block silently swallows API errors.
12. **Reset-password error detection** — `err.message.includes('400')` is fragile; should check typed `ApiError.status`.

### LOW
13. **EmailService not wired for reset tokens** — Exists but not called. Needs SMTP configuration.
14. **`.env.example`** — Missing `ALLOWED_ORIGINS`, `EMAIL_*` keys, `HANGFIRE_*` config.

---

## 7. UI References Without Backing Implementation

| UI Element | Expected Behaviour | Status |
|---|---|---|
| `onboarding/page.tsx` "Enter Workspace" | Calls `/api/auth/onboarding/complete` | ❌ Endpoint missing — 404 on submit |
| `/settings` page sidebar "Agency Profile" | Shows and saves org settings | ✅ (backend exists) |
| `/settings` — no change-password | Should be in account/security section | ❌ Missing |
| Project detail DELETE button (if present) | `DELETE /api/projects/{id}` | ❌ Endpoint missing |
| Task status update | `PATCH /api/tasks/{id}/status` | ❌ Endpoint missing |

---

## Fix Summary (by Phase)

| Phase | Action |
|---|---|
| 2 | Redesign landing page (nav, metadata, auth redirect, features) |
| 2 | Update middleware: add all public paths, redirect auth users from `/` |
| 2 | Update NavbarWrapper: hide nav on all public/auth pages |
| 3 | Fix middleware PUBLIC_PATHS (critical) |
| 3 | Add confirm-password + inline validation to /register and /signup |
| 3 | Fix onboarding: optional logo, error handling, step validation |
| 3 | Add `POST /api/auth/onboarding/complete` to AuthController |
| 3 | Add `POST /api/auth/change-password` to AuthController + AuthService |
| 3 | Implement real ForgotPassword: generate token, store in User, log/email link |
| 3 | Implement real ResetPassword: validate token + expiry, clear after use |
| 3 | Add PasswordResetToken + PasswordResetTokenExpiry to User entity |
| 4 | Verify onboarding saves to DB via new endpoint |
| 5 | Add Projects GET/:id, PUT/:id, DELETE/:id (controller + service + DTOs) |
| 5 | Add Tasks GET/:id, PUT/:id, DELETE/:id, PATCH/:id/status |
| 7 | Add change-password section to /settings page |
| 8 | Update .env.example with all required keys |
