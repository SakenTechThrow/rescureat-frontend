# RescuEat Frontend Audit (Next.js App Router)

Date: 2026-04-18

## 1) Route inventory

| Route | File | Component type | Auth required now | Backend calls |
|---|---|---|---|---|
| `/` | `app/page.tsx` | Server | No | None |
| `/deals` | `app/deals/page.tsx` (+ `components/DealsBrowse.tsx`) | Server page + Client browse component | No | `GET /api/deals` (server), `GET /api/deals/nearby` (client geolocation mode) |
| `/deals/[id]` | `app/deals/[id]/page.tsx` (+ `components/ReserveDealButton.tsx`) | Server page + Client reserve action | No gate in UI; reserve depends on backend auth | `GET /api/deals/:id` (server), `POST /api/reservations` (client) |
| `/reservations` | `app/reservations/page.tsx` | Client | Soft-protected only (no route guard; relies on API auth) | `GET /api/reservations` (client) |
| `/dashboard/cafe` | `app/dashboard/cafe/page.tsx` with `app/dashboard/cafe/layout.tsx` | Server page wrapped by Client auth layout | Yes (client-side token + role check) | `GET /api/deals` (server), `DELETE /api/deals/:id` (client button) |
| `/dashboard/cafe/new-listing` | `app/dashboard/cafe/new-listing/page.tsx` with `app/dashboard/cafe/layout.tsx` | Client page + Client auth layout | Yes (client-side token + role check) | `POST /api/deals` (client) |
| `/login` | `app/login/page.tsx` | Client | No | `POST /api/auth/login` (client via `loginWithEmailPassword`) |
| `/register` | `app/register/page.tsx` | Client | No | `POST /api/auth/register` and fallback `POST /api/auth/login` |
| `/reservation-success` | `app/reservation-success/page.tsx` | Server | No | None |
| `/for-cafes` | `app/for-cafes/page.tsx` | Server | No | None |

## 2) Auth integration check

### Token storage + helper behavior
- Token/role/name/email are stored in `localStorage` keys (`rescuEat_token`, `rescuEat_role`, etc.).
- `authHeaders()` always sets `Content-Type: application/json`, and adds `Authorization: Bearer <token>` only if a token exists in localStorage.
- `getToken()`/`getRole()` return `null` during SSR (`typeof window === "undefined"`).

### Protected request coverage
All four requested protected actions do call `authHeaders()`:
- Create listing: `POST /api/deals` in `app/dashboard/cafe/new-listing/page.tsx`.
- Delete listing: `DELETE /api/deals/:id` in `components/DeleteListingButton.tsx`.
- Reserve deal: `POST /api/reservations` in `components/ReserveDealButton.tsx`.
- View reservations: `GET /api/reservations` in `app/reservations/page.tsx`.

Important nuance: these calls include Bearer token only if token exists in localStorage; there is no frontend hard stop before calling.

### SSR / App Router pitfalls currently present
- Server components (`/deals`, `/deals/[id]`, `/dashboard/cafe`) call backend using hardcoded `<api-base-url>`. In production SSR, this often breaks unless backend is reachable from Vercel runtime.
- `/dashboard/cafe` role guard is client-side only (`useEffect` in layout). Server page fetch runs before redirect, which can leak unauthorized data if backend endpoint itself is not role-scoped.
- Using localStorage means no server-readable auth in SSR. Any server-side personalized fetch cannot attach user token with current architecture.

### Runtime/bug patterns found
- In `app/deals/[id]/page.tsx`, `params` is typed as `Promise<{ id: string }>` and awaited. App Router `params` should be an object, not a Promise. This can create type/runtime confusion.
- `components/DealsBrowse.tsx` has `initialDeals: DealListItem[]`, but `app/deals/page.tsx` passes raw unknown data cast as `any` without normalization. If API shape drifts, render bugs are likely.
- API URL is hardcoded throughout auth/deals/reservations flows, creating deployment fragility.

## 3) UX / MVP completeness

### What works for main flows (assuming backend behaves)
- Cafe flow: login/register -> redirect to cafe dashboard -> create listing -> listing appears in deals (global list endpoint).
- Student flow: login/register -> browse deals -> open detail -> reserve -> success page -> reservations table fetch.

### Gaps for clean demo quality
- Missing strong role gating on `/reservations` and `/dashboard/cafe` at route-level/server-level.
- Error boundaries and friendly recovery are minimal for server-rendered fetch failures (`throw new Error(...)` without route-level `error.tsx`).
- Loading states are inconsistent: client pages have spinners/messages, but server pages lack suspense/loading skeletons.
- Empty states exist in several places, but auth-required empty/error states need clearer CTAs (e.g., auto-redirect to login on 401 in reservations).
- `for-cafes` CTA button is placeholder and not wired to onboarding/login route.

## 4) Deployment readiness

### Current blockers
- Hardcoded backend origin (`<api-base-url>`) in multiple files blocks cloud deployment.
- No centralized API client or environment-driven base URL.

### Recommended API base strategy (minimal)
- Add `NEXT_PUBLIC_API_URL` (client + server accessible in Next via `process.env.NEXT_PUBLIC_API_URL`).
- Add helper `apiBaseUrl()` and use `${apiBaseUrl()}/api/...` everywhere.
- Set Vercel env per environment:
  - Preview: staging backend URL
  - Production: production backend URL

### Token strategy for MVP
- localStorage token is acceptable for MVP speed, but note XSS risk and no SSR auth.
- For post-MVP hardening: move to httpOnly cookie session/JWT and middleware-based route protection.

## 5) Prioritized fix plan

### P0 (must do for MVP demo + deploy)
1. Centralize API URL and remove all hardcoded localhost references.
2. Fix `/deals/[id]` params typing to standard App Router signature.
3. Add robust auth redirects for protected UX paths:
   - `/dashboard/cafe*` keep role guard, but prevent server data prefetch leakage.
   - `/reservations` redirect unauthenticated users to `/login` before fetch or on 401.
4. Normalize `/deals` payload before rendering cards (remove `as any`).

### P1 (high value for reliability)
5. Add route-level `loading.tsx` and `error.tsx` for core segments (`/deals`, `/deals/[id]`, `/dashboard/cafe`, `/reservations`).
6. Add shared API error handler for 401/403 with consistent UI messaging and action links.
7. Wire `/for-cafes` CTA to `/register?role=cafe` (or `/login`) for demo coherence.

### P2 (post-MVP hardening)
8. Migrate auth from localStorage to httpOnly cookies for production security.
9. Introduce middleware-based role gating and server-side token propagation.
10. Add integration tests for the two critical flows (cafe listing lifecycle + student reservation lifecycle).

## A) What works reliably now
- Core navigation and route rendering are complete for homepage, deals browsing, auth pages, reservations list, and cafe dashboard.
- Login/register persist auth state and perform role-based redirect.
- Protected mutations/reads use `authHeaders()` consistently.

## B) What breaks / why (exact files)
- Deployment break risk due to localhost URLs:
  - `lib/auth.ts`
  - `app/deals/page.tsx`
  - `app/deals/[id]/page.tsx`
  - `components/DealsBrowse.tsx`
  - `app/dashboard/cafe/page.tsx`
  - `app/dashboard/cafe/new-listing/page.tsx`
  - `components/DeleteListingButton.tsx`
  - `components/ReserveDealButton.tsx`
  - `app/reservations/page.tsx`
- Auth/authorization reliability gap due to client-only gating:
  - `app/dashboard/cafe/layout.tsx`
  - `app/reservations/page.tsx`
- Type/shape fragility:
  - `app/deals/[id]/page.tsx` (`params` typed as Promise)
  - `app/deals/page.tsx` (`raw as any`)

## C) Top fixes in order (MVP first)
1. Env-based API URL + helper.
2. Fix deals detail params signature.
3. Harden protected-route behavior and 401 handling.
4. Normalize deal list input before rendering.
5. Add loading/error route files.

## D) Minimal changes to deploy frontend (Vercel-ready)
1. Add `NEXT_PUBLIC_API_URL` in Vercel env vars.
2. Replace all `<api-base-url>` usages with env helper.
3. Validate CORS on backend for Vercel frontend origin(s).
4. Keep localStorage token for MVP, document security tradeoff.
