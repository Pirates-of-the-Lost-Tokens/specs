# Frontend Architecture

## Stack

| Concern | Library |
|---|---|
| Build | Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS + shadcn/ui |
| Server state | TanStack Query |
| Diagram | React Flow |
| HTTP client | Axios (with `withCredentials: true` for cookie auth) |

## Route Structure

```
/                         Redirect → /dashboard (authed) or /login
/login                    LoginPage             (public only — redirect if authed)
/onboarding               OnboardingPage        (authed, not-yet-onboarded only)
/dashboard                DashboardPage         (requires auth)
/browse                   CatalogPage           (requires auth)
/roadmaps/:id             RoadmapViewerPage     (requires auth + active enrolment)
/roadmaps/new             RoadmapBuilderPage    (requires auth)
/roadmaps/:id/edit        RoadmapBuilderPage    (requires auth + ownership)
*                         NotFoundPage
```

## Directory Structure

```
src/
├── layouts/
│   ├── AppShell.tsx          # Top nav + breadcrumb + <Outlet />
│   └── AuthLayout.tsx        # Centered card layout (login, onboarding)
│
├── pages/
│   ├── LoginPage.tsx
│   ├── OnboardingPage.tsx
│   ├── DashboardPage.tsx
│   ├── CatalogPage.tsx
│   ├── RoadmapViewerPage.tsx
│   ├── RoadmapBuilderPage.tsx
│   └── NotFoundPage.tsx
│
├── components/
│   ├── nav/
│   │   ├── TopNav.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── UserMenu.tsx
│   ├── roadmap/
│   │   ├── RoadmapCard.tsx         # Catalog + dashboard card
│   │   ├── RoadmapViewer.tsx       # React Flow (read-only)
│   │   ├── RoadmapBuilder.tsx      # React Flow (editable)
│   │   ├── TopicDetailPanel.tsx    # Sidebar on topic click
│   │   └── TextImportEditor.tsx    # Markdown text → roadmap
│   └── ui/                         # shadcn components (do not modify)
│
├── hooks/
│   ├── useAuth.ts            # Current user query + onboarding state
│   ├── useRoadmaps.ts        # Catalog list + single roadmap
│   ├── useEnrolment.ts       # Enrol / unenrol mutations
│   └── useProgress.ts        # Per-topic status + dashboard summary
│
└── lib/
    ├── api.ts                # Axios instance (baseURL + withCredentials)
    ├── queryClient.ts        # TanStack Query client config
    └── textParser.ts         # Markdown text format → roadmap node/edge structure
```

## Auth Guard Pattern

Route protection is handled via React Router layout routes:

```
<Route element={<RequireAuth />}>           // redirects to /login if no session
  <Route element={<RequireOnboarded />}>    // redirects to /onboarding if not onboarded
    <Route element={<AppShell />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/browse" element={<CatalogPage />} />
      <Route path="/roadmaps/:id" element={<RoadmapViewerPage />} />
      <Route path="/roadmaps/new" element={<RoadmapBuilderPage />} />
      <Route path="/roadmaps/:id/edit" element={<RoadmapBuilderPage />} />
    </Route>
  </Route>
</Route>
```

`RequireAuth` calls `useAuth()` — if the `/users/me` query returns 401, it redirects to `/login`.

## Server State Conventions

- All server state lives in TanStack Query — no duplicating API data in `useState`.
- Mutations use optimistic updates for progress status changes (feels instant).
- Roadmap node/edge data for React Flow is derived in the query layer, not in the component.
- Query keys follow `['roadmaps', id]`, `['progress', roadmapId]`, `['enrolments']` patterns.

## React Flow Integration

- **Viewer** (`RoadmapViewer.tsx`): `fitView`, `nodesDraggable=false`, `nodesConnectable=false`. Topic status mapped to node colour via a custom node component.
- **Builder** (`RoadmapBuilder.tsx`): Full interactivity. Node positions persisted on drag-end via a debounced PATCH. New edges trigger `POST /roadmaps/:id/edges`.
- Both viewer and builder share a `useRoadmapGraph` hook that transforms the API response (`topics[]` + `edges[]`) into React Flow's `nodes[]` + `edges[]` format.
