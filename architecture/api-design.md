# API Design

All endpoints are prefixed with `/api`. All protected routes require a valid JWT in the `httpOnly` cookie. Admin-only routes additionally require `user.isAdmin = true`.

## Auth

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/auth/google` | Redirect to Google OAuth consent screen |
| `GET` | `/auth/google/callback` | Handle Google OAuth callback, set cookie, redirect to frontend |
| `GET` | `/auth/github` | Redirect to GitHub OAuth consent screen |
| `GET` | `/auth/github/callback` | Handle GitHub OAuth callback, set cookie, redirect to frontend |
| `POST` | `/auth/logout` | Clear JWT cookie |

## Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users/me` | Required | Get current user profile |
| `PATCH` | `/users/me` | Required | Update display name or avatar |
| `POST` | `/users/me/onboard` | Required | Complete onboarding (sets `onboardedAt`) |

## Roadmaps

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/roadmaps` | Required | List published roadmaps. Query: `search`, `tags` (comma-separated) |
| `POST` | `/roadmaps` | Required | Create a new roadmap (starts as draft) |
| `POST` | `/roadmaps/from-text` | Required | Parse text format and create roadmap as draft |
| `GET` | `/roadmaps/:id` | Required | Get roadmap with topics, edges, sections, and resources |
| `PATCH` | `/roadmaps/:id` | Required (owner) | Update title, description, tags |
| `DELETE` | `/roadmaps/:id` | Required (owner) | Delete roadmap and all associated data |
| `POST` | `/roadmaps/:id/publish` | Required (owner) | Publish roadmap |
| `POST` | `/roadmaps/:id/unpublish` | Required (owner) | Unpublish roadmap |
| `POST` | `/roadmaps/:id/duplicate` | Required | Duplicate roadmap as a new draft owned by caller |

## Topics & Edges

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/roadmaps/:id/topics` | Required (owner) | Add a topic node |
| `PATCH` | `/topics/:id` | Required (owner or admin) | Update topic title, description, position |
| `DELETE` | `/topics/:id` | Required (owner) | Delete topic and its edges |
| `POST` | `/roadmaps/:id/edges` | Required (owner) | Add an edge between two topics |
| `DELETE` | `/edges/:id` | Required (owner) | Remove an edge |
| `POST` | `/roadmaps/:id/sections` | Required (owner) | Add a section under a topic |
| `PATCH` | `/sections/:id` | Required (owner) | Update section title or order |
| `DELETE` | `/sections/:id` | Required (owner) | Delete section (topics are unlinked, not deleted) |

## Resources

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/topics/:id/resources` | Required (owner or admin) | Add a resource to a topic |
| `PATCH` | `/resources/:id` | Required (owner or admin) | Update resource title, URL, type, order |
| `DELETE` | `/resources/:id` | Required (owner or admin) | Remove a resource |

## Enrolments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/enrolments` | Required | List current user's active enrolments |
| `POST` | `/enrolments` | Required | Enrol in a roadmap `{ roadmapId }` |
| `DELETE` | `/enrolments/:roadmapId` | Required | Unenrol (soft delete — preserves progress) |

## Progress

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/roadmaps/:id/progress` | Required | Get per-topic progress for current user on a roadmap |
| `PUT` | `/topics/:id/progress` | Required | Set topic status `{ status: NOT_STARTED \| IN_PROGRESS \| DONE \| SKIPPED }` |
| `PUT` | `/enrolments/:roadmapId/last-viewed` | Required | Update last viewed topic `{ topicId }` |
| `GET` | `/progress/summary` | Required | Dashboard summary: enrolments + completion % + recently completed topics |

## Conventions

- All responses follow `{ data, meta? }` envelope.
- Errors follow `{ error: { code, message } }`.
- Pagination via `?page=1&limit=20` where applicable.
- `owner` guard: checks `roadmap.createdById === req.user.id`.
- `admin` guard: checks `user.isAdmin === true` (future-proofing for seeded content editing).
