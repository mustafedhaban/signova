# PROJECT_CONTEXT

> Token-efficient onboarding reference for Signova. Last updated: 2026-05-27.

**For agents:** Read this file first (~2.3k words) instead of exploring the whole monorepo. RepoPrompt `context_builder` curated 28 files (~17k tokens) into this doc.

**Skip unless task-specific:** `node_modules/`, `apps/web/dist/`, `.vite/`, `apps/api/prisma/dev.db`, `screenshots/`, `prompt-exports/`, `*.tsbuildinfo`. Prefer `apps/api/src/` over `apps/api/dist/`.

---

## 1. Project Overview

Signova is a **SaaS email signature builder** (Signature Hound–style). It is early-stage / MVP: authentication uses a dev email→JWT flow (Google OAuth is commented out but preserved). The core loop is: login → create/edit signature in a visual builder → export or share via link.

- **Status:** MVP functional; Google/Microsoft OAuth not active; no email delivery yet
- **DB:** SQLite (local `dev.db`); ready to migrate to Postgres when needed
- **Auth:** Dev login (email → JWT) + register + password reset (token in response, no email send)

---

## 2. Monorepo Structure

Managed with **pnpm workspaces** (`pnpm-workspace.yaml`).

| Workspace | Path | Role |
|---|---|---|
| `@signova/web` | `apps/web` | React 18 + Vite frontend |
| `@signova/api` | `apps/api` | NestJS 10 REST backend |
| `@signova/types` | `packages/types` | Shared TypeScript interfaces |

`pnpm-workspace.yaml` globs: `apps/*`, `packages/*`.

`allowBuilds`: `@nestjs/core`, `@prisma/client`, `@prisma/engines`, `msw`, `prisma`.

Cross-package dependency: both `apps/web` and `apps/api` reference `@signova/types` via `"workspace:*"`.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18, React Router v6, Vite 8 |
| Styling | Tailwind CSS 3 (`darkMode: ["class"]`), OKLCH CSS variables, `tailwindcss-animate` |
| UI primitives | **Base UI v1** (`@base-ui/react`) for dropdown/menu; Radix UI for dialog, label, separator, slot, toast |
| Component helpers | shadcn/ui conventions, CVA, `clsx`, `tailwind-merge` |
| Theme | `next-themes` (`ThemeProvider`, `attribute="class"`) |
| Icons | `lucide-react`, `@hugeicons/react` + `@hugeicons/core-free-icons` |
| Data fetching | TanStack React Query v5 + axios |
| Forms | React Hook Form v7 + Zod v3 + `@hookform/resolvers` |
| Toast | `sonner` |
| Backend framework | NestJS 10 |
| ORM | Prisma 5 (SQLite in dev) |
| Auth | `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`; `passport-google-oauth20` installed but inactive |
| Validation | `class-validator`, `class-transformer`; `ValidationPipe({ whitelist: true, transform: true })` |
| Testing (API) | Jest 29, ts-jest, `@nestjs/testing`, supertest |
| Testing (Web) | Vitest 4 |
| Package manager | pnpm workspaces |
| Font | `@fontsource-variable/nunito-sans` (only font imported at runtime) |

---

## 4. Dev Setup

```
# 1. Install all workspaces from repo root
pnpm install

# 2. Create apps/api/.env (see §5)
cp apps/api/.env.example apps/api/.env   # if .env.example exists, else create manually

# 3. Generate Prisma client & push schema
cd apps/api && pnpm prisma:generate && pnpm prisma:push

# 4. Start API (port 3000) and Web (port 5173) in separate terminals
cd apps/api && pnpm dev
cd apps/web  && pnpm dev
```

- Web accesses API at `http://localhost:3000/api/v1` (hardcoded in `useAuth.tsx` and `useSignatures.ts`)
- If port 5173 is busy, Vite auto-increments to 5174; the API `FRONTEND_URL` env var must match

---

## 5. Environment Variables

**File:** `apps/api/.env` (gitignored; not committed)

| Variable | Required | Dev Default | Notes |
|---|---|---|---|
| `DATABASE_URL` | ✅ | `file:./dev.db` | SQLite path relative to `apps/api` |
| `JWT_SECRET` | ✅ | *(set manually)* | Signs 1h access tokens |
| `REFRESH_TOKEN_SECRET` | ✅ | *(set manually)* | Signs 7d refresh tokens |
| `FRONTEND_URL` | ✅ | `http://localhost:5173` | Used in share link generation |
| `GOOGLE_CLIENT_ID` | ❌ | — | Not needed; OAuth commented out |
| `GOOGLE_CLIENT_SECRET` | ❌ | — | Not needed |
| `GOOGLE_CALLBACK_URL` | ❌ | — | Not needed |

---

## 6. API Endpoints

**Base URL:** `http://localhost:3000/api/v1`

Global: `ValidationPipe({ whitelist: true, transform: true })`, open CORS.

### Auth (`/auth`)

| Method | Path | Guard | Behaviour |
|---|---|---|---|
| POST | `/auth/dev-login` | none | `{ email }` → upsert user (`provider:"dev"`) → `{ access_token, refresh_token, user }` |
| POST | `/auth/register` | none | `{ email, name }` → create user → tokens; `409` if duplicate |
| POST | `/auth/forgot-password` | none | `{ email }` → sets `resetToken` (+1h) → returns `{ resetToken }` directly (no email sent) |
| POST | `/auth/reset-password` | none | `{ token }` → validates expiry → issues new token pair |
| POST | `/auth/refresh` | none | `{ refresh_token }` → verifies + hash-compares → new token pair |
| POST | `/auth/logout` | JWT | Nulls stored `refreshToken` hash |
| GET | `/auth/profile` | JWT | Returns `req.user` from JWT payload |

### Signatures (`/signatures`)

All routes require JWT guard.

| Method | Path | Behaviour |
|---|---|---|
| POST | `/signatures` | Create signature for authed user |
| GET | `/signatures` | List all signatures for authed user (ordered by `updatedAt desc`) |
| GET | `/signatures/:id` | Get single signature (ownership checked) |
| PATCH | `/signatures/:id` | Update signature (ownership checked) |
| DELETE | `/signatures/:id` | Delete signature (ownership checked) |
| GET | `/signatures/:id/share` | Returns `{ url }` with base64url share token |

### Share (public)

| Method | Path | Behaviour |
|---|---|---|
| GET | `/share/:token` | Decodes base64url token → returns signature payload (no auth) |

### Other modules (all JWT-guarded)

- `/organizations` — CRUD + branding + member invite
- `/teams` — CRUD; used for bulk signature assignment
- `/templates` — CRUD; `isPublic` defaults to `true`
- `/users` — profile update

---

## 7. Database Schema (Prisma / SQLite)

| Model | Key Fields | Notes |
|---|---|---|
| `User` | `id` (uuid), `email` (unique), `name`, `avatarUrl?`, `provider` ("dev"/"google"/"microsoft"), `resetToken?`, `resetTokenExpiry?`, `refreshToken?` | `refreshToken` stores SHA-256 hash (not raw token) |
| `Organization` | `id`, `name`, `slug` (unique), `logoUrl?`, `bannerUrl?`, `primaryColor?`, `secondaryColor?`, `fontFamily?` (default "Arial"), `fontSize?` (default "14"), `website?` | Branding fields used by `BrandingPanel` |
| `OrganizationMember` | `id`, `role` ("owner"/"admin"/"member"), `userId`, `organizationId` | Unique on `[userId, organizationId]`; cascade delete on org delete |
| `Template` | `id`, `name`, `description?`, `category?`, `tags?` (JSON string), `thumbnailUrl?`, `isPublic` (true), `organizationId?` | `tags` is a JSON-encoded string array |
| `Signature` | `id`, `name`, `email`, `templateId`, `userId`, `teamId?`, `organizationId?`, `socialLinks?` (JSON string), `primaryColor?`, `fontFamily?`, plus contact fields | `socialLinks` stored as JSON string; parsed to array in service layer |
| `Team` | `id`, `name`, `userId` | Simple grouping model; signatures link via `teamId?` |

**`socialLinks` JSON format** (stored in `Signature.socialLinks`):
```json
[{ "platform": "linkedin", "url": "https://..." }]
```
Parsed on every read in `SignaturesService.findAll` / `findOne`.

---

## 8. Frontend Routes

All pages are `React.lazy`-loaded. Wrapped at root in `ThemeProvider` (next-themes) → `AuthProvider`.

| Path | Component | Access | Layout |
|---|---|---|---|
| `/login` | `LoginPage` | Public | `AuthLayout` |
| `/register` | `RegisterPage` | Public | `AuthLayout` |
| `/forgot-password` | `ForgotPasswordPage` | Public | `AuthLayout` |
| `/reset-password` | `ResetPasswordPage` | Public | `AuthLayout` |
| `/auth-callback` | `AuthCallback` | Public | — (redirects to `/login`) |
| `/shared/:token` | `SharedSignature` | Public | — |
| `/` | `Dashboard` | `ProtectedRoute` | `AppLayout` |
| `/builder/:id` | `Builder` | `ProtectedRoute` | `AppLayout` |
| `/settings` | `Settings` | `ProtectedRoute` | `AppLayout` |
| `/organizations` | `OrganizationSettings` | `ProtectedRoute` | `AppLayout` |

- `ProtectedRoute` checks `useAuth().token`; shows `<PageLoading />` while `isLoading`; redirects to `/login` if no token
- `AppLayout` uses a **render-prop pattern**: `children(activeTab, setActiveTab, openSidebar)` — pages receive these as arguments, not via React context

---

## 9. Auth Flow

```
Login form → POST /auth/dev-login
  → { access_token, refresh_token, user }
  → localStorage.setItem('token', access_token)
  → localStorage.setItem('refresh_token', refresh_token)
  → axios.defaults.headers.common['Authorization'] = 'Bearer <token>'
  → navigate('/')

AuthProvider mount:
  → reads localStorage 'token'
  → if present: GET /auth/profile → setUser()
  → if missing: setIsLoading(false)

401 interceptor (axios):
  → fires POST /auth/refresh with refresh_token from localStorage
  → on success: updates localStorage + axios header, retries original request
  → on failure: calls logout()

logout():
  → fire-and-forget POST /auth/logout (server nulls refreshToken hash)
  → clears localStorage, clears axios header, navigate('/login')
```

- **Access token:** JWT, 1h expiry, signed with `JWT_SECRET`
- **Refresh token:** JWT, 7d expiry, signed with `REFRESH_TOKEN_SECRET`; SHA-256 hash stored on `User.refreshToken`
- **API base URL is hardcoded** in `useAuth.tsx` and `useSignatures.ts` as `http://localhost:3000/api/v1`

---

## 10. Key Patterns & Pitfalls

### `toSignatureApiPayload(data)`
- Location: `apps/web/src/features/signatures/utils/api-payload.ts`
- Strips empty-string values from: `website`, `logoUrl`, `organizationId`, `phone`, `mobile`, `title`, `company`, `department`, `address`
- **Must be called** before every `POST`/`PATCH` to `/signatures` — Prisma rejects empty strings for optional URL/UUID fields

### `useSignatures` — `mutateAsync` not `mutate`
- `createSignature` and `deleteSignature` are exposed as `mutateAsync`
- Callers **must** wrap in `try/catch` or handle the returned Promise; errors are thrown, not swallowed

### `AppLayout` render-prop
- Pages using `AppLayout` receive `(activeTab, setActiveTab, openSidebar)` as function arguments
- Do **not** wrap children in a `<div>` and expect props via context — the pattern is an explicit function call

### `dropdown-menu.tsx` — Base UI, NOT Radix
- Uses `@base-ui/react/menu` (`MenuPrimitive`)
- `DropdownMenuLabel` renders as `MenuPrimitive.GroupLabel` — **must be inside `<DropdownMenuGroup>`**
- Do not treat it as standalone Radix `DropdownMenuLabel`; the prop shapes differ

### Signature `socialLinks` serialisation
- Stored as JSON string in SQLite; service layer parses to `ISocialLink[]` on every read
- Write path: pass array in DTO; `SignaturesService.toPrismaData` calls `JSON.stringify`

---

## 11. Design System

| Token | Value |
|---|---|
| Primary | `oklch(0.505 0.213 27.518)` — coral-red |
| Background | `oklch(1 0 0)` light / `oklch(0.145 0.008 326)` dark |
| Card dark | `oklch(0.212 0.019 322.12)` |
| Radius base | `0.875rem` (`--radius`) |
| Font sans | `'Nunito Sans Variable'` (only font loaded at runtime) |
| Font heading | `var(--font-sans)` (same; Playfair not wired) |
| Success | `oklch(0.52 0.14 145)` |
| Easing spring | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` |
| Dark mode toggle | `darkMode: ["class"]` in Tailwind; toggled by `next-themes` `attribute="class"` |

- All colors mapped to CSS variables in `apps/web/src/index.css`
- Custom Tailwind tokens: `success`, `sidebar-*`, `shadow-soft`, `shadow-glass`
- `tw-animate-css` and `tailwindcss-animate` both present; `shadcn/tailwind.css` imported in `index.css`

---

## 12. Known Gotchas

| # | Issue | Location |
|---|---|---|
| 1 | `IUser.provider` typed as `'google'\|'microsoft'` but DB/auth also uses `'dev'` | `packages/types/src/index.ts` |
| 2 | API base URL hardcoded as `http://localhost:3000/api/v1` | `useAuth.tsx`, `useSignatures.ts`, all feature hooks |
| 3 | Vite port auto-increments if 5173 busy → `FRONTEND_URL` env var must match | `apps/api/.env` |
| 4 | `passport-google-oauth20` still in `apps/api/package.json` deps; `google.strategy.ts` exists but body is commented out | `apps/api/src/auth/strategies/google.strategy.ts` |
| 5 | `forgotPassword` returns `resetToken` directly in response — no email is sent | `apps/api/src/auth/auth.service.ts` |
| 6 | `DropdownMenuLabel` must be a child of `DropdownMenuGroup` (Base UI requirement) | `apps/web/src/components/ui/dropdown-menu.tsx` |
| 7 | `apps/api/prisma/dev.db` is gitignored — new devs must run `prisma:push` to create it | `.gitignore` |
| 8 | `AuthCallback` immediately redirects to `/login` — it no longer processes OAuth tokens | `apps/web/src/pages/AuthCallback.tsx` |

---

## 13. Recent Changes

| Date | Change |
|---|---|
| 2026-05-26 | All DESIGN_REVIEW.md Must/Should fixes applied: success tokens, dark-mode surfaces, `AuthLayout` theme toggle, mobile full-width, Nunito-only typography, reduced-motion, `PageLoading`, `AlertDialog` delete, navbar mobile menu, touch-visible card actions |
| 2026-05-26 | Google OAuth disabled: `GoogleStrategy` removed from `AuthModule` providers; routes commented out with `// TODO: Re-enable Google OAuth`; `AuthCallback` redirects to `/login` |
| 2026-05-26 | Prisma API dev updates; Trae git commit message rule added |
| 2026-05-06 | Migration: merge Organization model (`20260506160458_merge_organization_model`) |
| 2026-04-09 | Migrations: signature customization fields, template tags |
| 2026-04-08 | Migration: add reset token fields to User |

---

## 14. File Organisation

```
signova/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Single source of truth for DB models
│   │   │   └── migrations/          # Prisma migration history
│   │   └── src/
│   │       ├── auth/                # JWT auth, dev-login, password reset
│   │       ├── signatures/          # Signature CRUD + share link
│   │       ├── organizations/       # Org management + branding
│   │       ├── teams/               # Team grouping
│   │       ├── templates/           # Signature templates
│   │       ├── users/               # User profile updates
│   │       ├── prisma/              # PrismaModule + PrismaService (singleton)
│   │       ├── app.module.ts        # Root NestJS module
│   │       └── main.ts              # Bootstrap: port 3000, prefix api/v1
│   └── web/
│       └── src/
│           ├── components/
│           │   ├── ui/              # Base UI / shadcn primitives
│           │   ├── AppLayout.tsx    # Authenticated shell (render-prop)
│           │   ├── AuthLayout.tsx   # Unauthenticated wrapper + theme toggle
│           │   └── ProtectedRoute.tsx
│           ├── features/
│           │   ├── auth/hooks/      # useAuth (AuthProvider, token, login, logout)
│           │   ├── signatures/
│           │   │   ├── hooks/       # useSignatures (React Query)
│           │   │   ├── utils/       # toSignatureApiPayload, export helpers
│           │   │   ├── components/  # SignatureCard, SocialLinksEditor, etc.
│           │   │   └── templates/   # 6 React template renderers + socialIcons
│           │   ├── organizations/   # useOrganizations, BrandingPanel
│           │   └── teams/           # useTeams, CSVUploader
│           ├── pages/               # Route-level lazy-loaded page components
│           ├── App.tsx              # Router, ThemeProvider, AuthProvider
│           └── index.css            # OKLCH design tokens (light + dark)
└── packages/
    └── types/src/index.ts           # IUser, ISignature, ISocialLink, ITeam, ITeamMember
```

---

## 15. Key Data Flows

- **Login:** `LoginPage` → `POST /auth/dev-login` → `AuthService.devLogin()` → Prisma upsert `User` → `issueTokens()` → `useAuth.login()` → localStorage + axios header + navigate `/`

- **Auth guard:** `ProtectedRoute` checks `useAuth().token` → on mount `AuthProvider` calls `GET /auth/profile` → sets `user` in context

- **Create signature:** `Builder.tsx` → `useSignatures.createSignature(data)` → `toSignatureApiPayload(data)` → `POST /api/v1/signatures` → `SignaturesService.create()` → `toPrismaData()` (JSON-stringifies `socialLinks`) → Prisma `Signature.create`

- **Read signatures:** `useQuery(['signatures'])` → `GET /api/v1/signatures` → `SignaturesService.findAll()` → JSON-parses `socialLinks` per record → returns typed array

- **Share link:** `GET /signatures/:id/share` → `SignaturesService.generateShareLink()` → base64url-encodes payload → returns `{ url: "<FRONTEND_URL>/shared/<token>" }` → `GET /share/:token` decodes (public, no auth)

- **Token refresh:** axios 401 interceptor → `POST /auth/refresh` with `refresh_token` from localStorage → `AuthService.refresh()` verifies JWT + compares SHA-256 hash → issues new pair → interceptor retries original request; on failure calls `logout()`
