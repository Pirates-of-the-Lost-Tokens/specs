# System Overview

## Assumptions

- Frontend and API are served from the same domain (e.g. `learnmap.io` + `learnmap.io/api` via reverse proxy).
- Auth uses httpOnly cookies with `SameSite=Lax` — no cross-origin cookie complexity.

## Components

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                 │
│                                                          │
│  learnmap/app                                            │
│  React + Vite + React Router                             │
│  TanStack Query · React Flow · shadcn/ui                 │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS (REST + JSON)
                        │ httpOnly cookie (JWT, SameSite=Lax)
┌───────────────────────▼─────────────────────────────────┐
│  learnmap/api  (learnmap.io/api)                         │
│  NestJS + Prisma                                         │
│                                                          │
│  Modules:                                                │
│  auth · users · roadmaps · topics                        │
│  resources · enrolments · progress                       │
└──────────┬─────────────────────────┬────────────────────┘
           │                         │
┌──────────▼──────────┐   ┌──────────▼──────────┐
│  PostgreSQL          │   │  OAuth Providers     │
│  (Prisma ORM)        │   │  Google · GitHub     │
└─────────────────────┘   └─────────────────────┘
```

## Auth Flow

OAuth is handled directly in NestJS using **Arctic** (no Passport.js).

```
User clicks "Sign in with Google"
  → GET /api/auth/google
  → NestJS builds OAuth URL (Arctic), redirects to Google
  → User consents on Google
  → Google redirects to /api/auth/google/callback?code=...&state=...
  → NestJS: validate state, exchange code for tokens (Arctic)
  → NestJS: fetch user profile from Google
  → NestJS: find-or-create User + OAuthAccount in DB
  → NestJS: sign JWT, set httpOnly cookie (SameSite=Lax)
  → Redirect to frontend /auth/callback?new=true|false
  → Frontend: new=true → /onboarding, new=false → /dashboard
```

## Request Flow

1. Every authenticated API request carries the JWT in an `httpOnly` cookie automatically (browser handles it).
2. A global NestJS `JwtAuthGuard` validates the token on every protected route.
3. TanStack Query manages caching, deduplication, and background refetches on the frontend.
4. React Flow reads roadmap node/edge data from the API and renders the canvas entirely client-side.

## Repo Map

| Repo | Stack | Purpose |
|---|---|---|
| `learnmap/app` | React + Vite | Frontend SPA |
| `learnmap/api` | NestJS + Prisma | REST API + OAuth callbacks |
| `learnmap/specs` | Markdown | Requirements + Architecture |
| `learnmap/skills` | Markdown | Reusable AI skills (future) |
