# LearnMap

Monorepo for the LearnMap application — React UI, NestJS API, PostgreSQL.

## Structure

```
apps/
  web/     React + Vite frontend
  api/     NestJS + Prisma backend
packages/
  shared/  Shared TypeScript types
```

## Prerequisites

- Node.js 22+
- pnpm 10 (`corepack enable`)
- Docker (local Postgres)

## Setup

```bash
corepack enable
pnpm install
cp .env.example .env
docker compose up -d
pnpm --filter api exec prisma migrate dev
pnpm dev
```

- UI: http://localhost:5173
- API: http://localhost:3000/api/health

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start web + api in dev mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Typecheck all packages |
| `pnpm test` | Run tests |

## CI/CD

- **CI** (`.github/workflows/ci.yml`) — runs on every PR and push to `main`
- **Deploy** (`.github/workflows/deploy.yml`) — deploys to Railway on push to `main`

### GitHub secrets / variables

| Name | Type | Purpose |
|---|---|---|
| `RAILWAY_TOKEN` | Secret | Railway project token |
| `RAILWAY_SERVICE_NAME` | Variable | Railway service name (e.g. `learnmap`) |

Alternatively, connect Railway to GitHub and enable **Wait for CI** — then you can skip `deploy.yml`.

## Railway

1. Create a Railway project
2. Add PostgreSQL plugin → sets `DATABASE_URL`
3. Connect this repo, branch `main`
4. Set root directory to `/` (repo root)
5. Add `JWT_SECRET` env var
6. Deploy uses `railway.toml` build/start commands

Production serves the UI from the API (same origin) — Vite builds into `apps/api/public`.

## Push to your new GitHub repo

```bash
git remote add origin git@github.com:YOUR_ORG/learnmap.git
git push -u origin main
```
