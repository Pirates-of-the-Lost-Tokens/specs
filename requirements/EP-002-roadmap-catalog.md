# EP-002: Roadmap Catalog

**Status:** Approved
**Type:** Epic

## Goal

Authenticated users can browse, search, and filter the full library of available roadmaps, and enrol in the ones they want to learn.

## Functional Requirements

| ID | Requirement |
|---|---|
| FR-CAT-001 | Authenticated users can access a catalog page listing all available roadmaps. |
| FR-CAT-002 | Each roadmap has one or more tags (e.g. `frontend`, `backend`, `devops`, `react`, `python`). |
| FR-CAT-003 | Users can search roadmaps by name or keyword. Results update as the user types (debounced). |
| FR-CAT-004 | Users can filter the catalog by selecting one or more tags. Multiple selected tags return roadmaps that match **any** of them (OR logic). |
| FR-CAT-005 | Each catalog card shows: title, tags, short description, and topic count. |
| FR-CAT-006 | Roadmaps the user is already enrolled in are visually distinguished in the catalog (e.g. an "In progress" badge). |
| FR-CAT-007 | Users can enrol in a roadmap from the catalog. Enrolling adds it to their dashboard. |
| FR-CAT-008 | Users can unenrol from a roadmap. A confirmation prompt warns the user. Unenrolling soft-deletes the enrolment — progress is preserved and restored if the user re-enrols. |
| FR-CAT-009 | The initial roadmap library is seeded from roadmap.sh open-source content. |

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-CAT-001 | Catalog page loads within 1.5s (p95). |
| NFR-CAT-002 | Search results debounce at 300ms. |
| NFR-CAT-003 | Seeded roadmap data is stored in the database, not fetched from roadmap.sh at runtime. |

## Out of Scope

- Interactive roadmap viewer / node map (EP-003)
- Progress tracking within a roadmap (EP-004)
- User-created roadmaps (EP-005)
- Admin tooling for managing the catalog
