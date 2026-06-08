# EP-003: Roadmap Viewer

**Status:** Approved
**Type:** Epic

## Goal

Users can open any enrolled roadmap and navigate it as an interactive node-based diagram, view topic details and resources, and mark topics with a status.

## Functional Requirements

| ID | Requirement |
|---|---|
| FR-VIEW-001 | Clicking a roadmap from the dashboard or catalog opens the roadmap viewer. |
| FR-VIEW-002 | The viewer renders the roadmap as an interactive node-edge diagram. Nodes are topics; edges show progression. |
| FR-VIEW-003 | Topics are grouped into named sections visible in the diagram. |
| FR-VIEW-004 | Users can zoom and pan the diagram. |
| FR-VIEW-005 | A minimap in the corner shows the user's current position within the full diagram. |
| FR-VIEW-006 | Clicking a topic node opens a detail panel (sidebar or drawer) showing: title, description, and curated resources (links, articles, videos). |
| FR-VIEW-007 | Each topic has a status: `Not started` (default), `In progress`, `Done`, `Skipped`. |
| FR-VIEW-008 | Users can change a topic's status from the detail panel. |
| FR-VIEW-009 | Topic nodes are colour-coded by status so progress is visible at a glance. |
| FR-VIEW-010 | A progress bar at the top of the viewer shows overall completion percentage for the roadmap. |
| FR-VIEW-011 | Breadcrumb navigation lets users return to the dashboard or catalog. |
| FR-VIEW-012 | Topic resources are seeded from roadmap.sh content. Admins can add, edit, or remove resources on any topic after seeding. |

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-VIEW-001 | Diagram renders within 2s for roadmaps with up to 200 nodes (p95). |
| NFR-VIEW-002 | Status changes are reflected immediately via optimistic UI update. |
| NFR-VIEW-003 | Viewer is optimised for desktop. Mobile is a degraded but usable experience. |

## Out of Scope

- Editing the roadmap structure (EP-005)
- Progress dashboard and history across roadmaps (EP-004)
- Comments or personal notes on topics
