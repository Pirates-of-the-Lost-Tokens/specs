# LearnMap — Day-0 Bootstrap Guide

> **Purpose:** Scaffold the monorepo, wire CI/CD, and deploy a working “hello production” app to Railway.  
> **Repo to create:** `Pirates-of-the-Lost-Tokens/learnmap`  
> **Reference docs:** This repo (`specs`) — requirements and architecture. Issues tracked in **Linear**.

---

## Goal

Merge one PR to `main` and see a live app where:

- The UI loads from the same origin as the API
- `GET /api/health` returns `{ status: "ok" }`
- `GET /api/health/db` confirms Prisma can reach PostgreSQL
- GitHub Actions CI passes on every PR
- Railway auto-deploys after green CI on `main`

**Out of scope for Day-0:** OAuth, auth guards, catalog, React Flow, seed data, Playwright e2e.

---

## Stack (locked from reference architecture)

### Frontend (`apps/web`)

| Concern | Library | Notes |
|---|---|---|
| Runtime | React 19 | |
| Build | Vite 6 | Dev server + production bundle |
| Routing | React Router 7 | Layout routes, auth guards (Day-1+) |
| Styling | Tailwind CSS 4 + shadcn/ui | Component primitives in `src/components/ui/` |
| Server state | TanStack Query 5 | Caching, mutations, optimistic updates |
| Diagram | React Flow | Viewer + builder (EP-003, EP-005) |
| HTTP client | Axios | `baseURL: '/api'`, `withCredentials: true` |
| Language | TypeScript 5.7+ | Strict mode |

### Backend (`apps/api`)

| Concern | Library | Notes |
|---|---|---|
| Framework | NestJS 11 | Modules, guards, global prefix `/api` |
| ORM | Prisma 6 | Schema in `apps/api/prisma/` |
| Database | PostgreSQL 16 | Local via Docker; Railway plugin in prod |
| OAuth | Arctic | Google + GitHub (EP-001, Day-1+) |
| Auth | JWT in httpOnly cookie | `SameSite=Lax`, never localStorage |
| Static SPA | `@nestjs/serve-static` | Serves `public/` in production |
| Language | TypeScript 5.7+ | Strict mode |

### Monorepo & tooling

| Concern | Choice | Notes |
|---|---|---|
| Package manager | **pnpm 10** | Workspaces + catalogs for version pinning |
| Task runner | **Turborepo 2** | Build graph, caching, `^build` dependencies |
| Node | **22 LTS** | Via `corepack enable` |
| Lint / format | ESLint + Prettier | shadcn/ui compatible |
| Unit tests | Vitest | Web + API |
| Local DB | Docker Compose | Postgres 16 on port 5432 |

### Infrastructure

| Concern | Choice | Notes |
|---|---|---|
| CI | GitHub Actions | Lint, typecheck, test, build on PR |
| CD | Railway + “Wait for CI” | Deploy after green CI on `main` |
| Hosting | Railway | Single app service + Postgres plugin |
| Same-origin | NestJS serves Vite build | No CORS in prod; cookies work for EP-001 |

### Repos

| Repo | Purpose |
|---|---|
| `Pirates-of-the-Lost-Tokens/learnmap` | **Monorepo** — all application code |
| `Pirates-of-the-Lost-Tokens/specs` | Reference requirements + architecture (this repo) |
| `Pirates-of-the-Lost-Tokens/cursor-sdlc-workflow` | AI SDLC automation (integrate Day-1+) |

---

## Monorepo layout

```
learnmap/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # PR + main: lint, typecheck, test, build
│       └── deploy.yml             # Optional — only if Railway auto-deploy disabled
│
├── apps/
│   ├── web/                       # React + Vite SPA
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   └── StatusPage.tsx   # Day-0: health status UI
│   │   │   ├── components/
│   │   │   │   └── ui/              # shadcn components
│   │   │   ├── lib/
│   │   │   │   └── api.ts           # Axios instance
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts           # outDir → ../api/public; dev proxy /api
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                         # NestJS + Prisma
│       ├── src/
│       │   ├── main.ts              # listen on process.env.PORT
│       │   ├── app.module.ts        # ServeStaticModule + HealthModule
│       │   ├── health/
│       │   │   ├── health.module.ts
│       │   │   ├── health.controller.ts
│       │   │   └── health.service.ts
│       │   └── prisma/
│       │       ├── prisma.module.ts
│       │       └── prisma.service.ts
│       ├── prisma/
│       │   ├── schema.prisma        # Full schema from specs/architecture/data-model.md
│       │   ├── migrations/
│       │   └── seed.ts              # Empty stub Day-0; populated in EP-002
│       ├── public/                  # Web build output (gitignored)
│       ├── nest-cli.json
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   └── shared/                      # Shared TypeScript types
│       ├── src/
│       │   ├── index.ts
│       │   └── health.ts            # HealthResponse type
│       ├── tsconfig.json
│       └── package.json
│
├── docker-compose.yml               # Local Postgres
├── package.json                     # Root scripts: dev, build, lint, test
├── pnpm-workspace.yaml              # Workspaces + pnpm catalogs
├── turbo.json                       # Task pipeline
├── railway.toml                     # Build, pre-deploy migrate, start
├── .env.example                     # Documented env vars
├── .gitignore
├── README.md
└── CONTRIBUTING.md                  # Branch naming, PR conventions
```

### Key wiring decisions

| Decision | Implementation |
|---|---|
| Same-origin prod | Vite `outDir: '../api/public'`; NestJS `ServeStaticModule` serves `public/` |
| API prefix | All controllers under `/api`; static handler excludes `/api/*` |
| Dev proxy | Vite proxies `/api` → `http://localhost:3000` |
| Build order | `shared` → `web` (writes to `api/public`) → `api` |
| Railway root | **Repo root** (`/`) — not `apps/api` — so pnpm workspace resolves |

---

## Architecture (Day-0)

```
┌─────────────────────────────────────────────────────────┐
│  Browser → https://learnmap-production.up.railway.app   │
│                                                          │
│  GET /              → NestJS serves public/index.html    │
│  GET /dashboard     → SPA client routing (index.html)    │
│  GET /api/health    → NestJS HealthController            │
│  GET /api/health/db → NestJS + Prisma ping               │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │  Railway PostgreSQL      │
              └─────────────────────────┘
```

### Dev vs production

| Mode | Frontend | API | Notes |
|---|---|---|---|
| **Dev** | Vite `:5173` | Nest `:3000` | Vite proxy `/api` → `localhost:3000` |
| **Prod** | Static in `apps/api/public/` | Nest `:PORT` | Single Railway service |

No `VITE_API_URL` in production. Axios uses relative `/api` paths everywhere.

---

## Root config files

### `pnpm-workspace.yaml`

```yaml
packages:
  - apps/*
  - packages/*

catalog:
  react: ^19.0.0
  react-dom: ^19.0.0
  typescript: ^5.7.0
  vite: ^6.0.0
  "@tanstack/react-query": ^5.0.0
  axios: ^1.7.0
  tailwindcss: ^4.0.0
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "public/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: learnmap
      POSTGRES_PASSWORD: learnmap
      POSTGRES_DB: learnmap
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### `railway.toml`

```toml
[build]
builder = "RAILPACK"
buildCommand = "pnpm install --frozen-lockfile && pnpm turbo build --filter=api..."

[deploy]
preDeployCommand = "pnpm --filter api exec prisma migrate deploy"
startCommand = "node apps/api/dist/main.js"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

### `.env.example`

```env
# Database
DATABASE_URL=postgresql://learnmap:learnmap@localhost:5432/learnmap

# API
NODE_ENV=development
PORT=3000

# Auth (Day-1 — EP-001)
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d

# OAuth (Day-1 — STORY-1.2)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
OAUTH_REDIRECT_BASE_URL=http://localhost:3000

# Frontend (dev only — not needed in prod same-origin setup)
# VITE_* vars only if splitting services later (avoid)
```

---

## Day-0 deliverables

| # | Deliverable | Acceptance |
|---|---|---|
| 1 | Monorepo scaffold | `pnpm install` succeeds at root |
| 2 | API health | `GET /api/health` → `{ status: "ok" }` |
| 3 | DB health | `GET /api/health/db` → Prisma ping succeeds |
| 4 | Web UI | Status page shows API + DB status |
| 5 | Same-origin prod | NestJS serves Vite build; no CORS |
| 6 | Local dev | `docker compose up -d` + `pnpm dev` works |
| 7 | CI | PR runs lint, typecheck, test, build |
| 8 | CD | Merge to `main` → Railway deploys live URL |
| 9 | Migrations | `prisma migrate deploy` on deploy |
| 10 | Docs | README with clone → dev → deploy |

---

## Day-0 PR checklist

Branch: `cursor/day-0-bootstrap-1d12`

### Scaffold

- [ ] Create `learnmap` repo (private)
- [ ] pnpm workspaces + catalogs
- [ ] Turborepo config
- [ ] `docker-compose.yml`
- [ ] `.env.example`

### `apps/api`

- [ ] NestJS with strict TypeScript
- [ ] Prisma: full schema from `specs/architecture/data-model.md`
- [ ] Initial migration (`init`)
- [ ] `HealthModule`: `GET /api/health`, `GET /api/health/db`
- [ ] Global prefix `/api` on controllers
- [ ] `ServeStaticModule` → `public/`, exclude `/api/*`
- [ ] `main.ts` listens on `process.env.PORT`

### `apps/web`

- [ ] Vite + React + TypeScript
- [ ] Tailwind 4 + shadcn/ui init
- [ ] `StatusPage` fetching `/api/health` and `/api/health/db`
- [ ] Vite `outDir: '../api/public'`
- [ ] Dev proxy `/api` → `http://localhost:3000`

### `packages/shared`

- [ ] Export `HealthResponse` type shared by web + api

### CI

- [ ] `ci.yml`: lint, typecheck, test, build on PR
- [ ] Postgres service container for API integration tests
- [ ] Branch protection on `main` (PR required, CI must pass)

### Railway

- [ ] New project `learnmap`
- [ ] Postgres plugin → `DATABASE_URL`
- [ ] Connect GitHub repo, branch `main`
- [ ] Enable **Wait for CI**
- [ ] Set `JWT_SECRET` (random placeholder)
- [ ] Generate public domain
- [ ] Verify deploy after merge

### Docs

- [ ] `README.md`: prerequisites, dev setup, deploy flow
- [ ] `CONTRIBUTING.md`: branch naming, Linear ID in PR title

---

## CI/CD

### Recommended flow

```
PR opened → ci.yml (lint, typecheck, test, build)
         → review + merge

Merge to main → ci.yml runs again
             → Railway "Wait for CI" sees green
             → Railway builds + migrate + starts app
             → Public URL live
```

**Do not** enable both Railway auto-deploy and a separate `deploy.yml` — pick one path to avoid double deploys.

### `ci.yml` outline

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: learnmap
          POSTGRES_PASSWORD: learnmap
          POSTGRES_DB: learnmap_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm turbo lint typecheck test build
        env:
          DATABASE_URL: postgresql://learnmap:learnmap@localhost:5432/learnmap_test
```

### GitHub secrets (Day-0)

| Secret | Purpose |
|---|---|
| `RAILWAY_TOKEN` | Project token (only if using manual `deploy.yml`) |

### GitHub secrets (Day-1+)

| Secret | Purpose |
|---|---|
| `JWT_SECRET` | Can live in Railway only; mirror for CI if needed |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | OAuth |
| `ANTHROPIC_API_KEY` | AI workflow |

---

## Local development

```bash
# Prerequisites: Node 22, Docker, corepack
corepack enable
git clone git@github.com:Pirates-of-the-Lost-Tokens/learnmap.git
cd learnmap
pnpm install
docker compose up -d
cp .env.example .env
pnpm --filter api exec prisma migrate dev
pnpm dev
```

Open `http://localhost:5173` — status page should show API and DB as healthy.

### Root `package.json` scripts

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test"
  }
}
```

---

## NestJS static + API config (reference)

```typescript
// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/*'],
      renderPath: '/*',
    }),
    HealthModule,
  ],
})
export class AppModule {}
```

```typescript
// apps/api/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

---

## Vite config (reference)

```typescript
// apps/web/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../api/public',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## Definition of Done

| Check | How to verify |
|---|---|
| Local works | `pnpm dev` → UI shows API ok, DB ok |
| CI passes | PR checks green |
| Prod works | Merge → Railway deploys → public URL matches local behaviour |
| Same-origin | Network tab: all requests same host, `/api/*` |
| Migrations | Railway logs show `prisma migrate deploy` success |
| No secrets in git | `.env` gitignored; secrets in GitHub + Railway only |

---

## Post Day-0 roadmap

| Order | Story | Epic |
|---|---|---|
| 1 | Auth gate on all routes | EP-001 STORY-1.1 |
| 2 | OAuth sign-in (Google + GitHub) | EP-001 STORY-1.2 |
| 3 | Shared layout with top navigation | EP-000 STORY-0.1 |
| 4 | Seed roadmap library | EP-002 STORY-2.5 |
| 5 | Browse roadmap catalog | EP-002 STORY-2.1 |

Build order across epics: **EP-001 → EP-000 → EP-002 → EP-003 → EP-004 → EP-005**

---

## OAuth setup (Day-1 prep)

Document redirect URIs when creating OAuth apps:

| Provider | Local | Production |
|---|---|---|
| Google | `http://localhost:3000/api/auth/google/callback` | `https://<railway-domain>/api/auth/google/callback` |
| GitHub | `http://localhost:3000/api/auth/github/callback` | `https://<railway-domain>/api/auth/github/callback` |

---

## AI workflow integration (Day-1)

Once `cursor-sdlc-workflow` repo is accessible:

1. Compare with `specs/.github/workflows/issue-to-pr.yml`
2. Adapt for monorepo paths: `apps/web`, `apps/api`, `packages/shared`
3. Trigger from Linear (webhook or `workflow_dispatch` with Linear issue ID)
4. Branch naming: `cursor/<linear-id>-<slug>-1d12`

---

## Further reading

| Topic | Link |
|---|---|
| Railway monorepo | https://docs.railway.com/deployments/monorepo |
| Railway + GitHub Actions | https://blog.railway.com/p/github-actions |
| pnpm workspaces | https://pnpm.io/workspaces |
| pnpm catalogs | https://pnpm.io/catalogs |
| Turborepo | https://turbo.build/repo/docs |
| NestJS serve-static | https://docs.nestjs.com/recipes/serve-static |
| Arctic OAuth | https://arctic.js.org/ |
| shadcn + Vite | https://ui.shadcn.com/docs/installation/vite |
| Prisma + NestJS | https://docs.nestjs.com/recipes/prisma |
| Reference data model | [data-model.md](./data-model.md) |
| Reference frontend | [frontend.md](./frontend.md) |
| Reference API design | [api-design.md](./api-design.md) |
| Reference system overview | [system-overview.md](./system-overview.md) |
