# EP-000: App Shell & Navigation

**Status:** Approved
**Type:** Epic

## Goal

Every page in LearnMap shares a consistent layout with persistent navigation, so users can always orient themselves and move between sections.

## Functional Requirements

| ID | Requirement |
|---|---|
| FR-SHELL-001 | All authenticated pages render inside a shared layout with a top navigation bar. |
| FR-SHELL-002 | The top nav contains: the LearnMap logo (links to dashboard), a **Dashboard** link, a **Browse Roadmaps** link, and a user avatar menu on the right. |
| FR-SHELL-003 | The nav item for the current section is visually highlighted (active state). |
| FR-SHELL-004 | The user avatar menu contains: the user's display name, a **Profile & Settings** link, and a **Sign out** option. |
| FR-SHELL-005 | Pages that are nested (e.g. viewing a roadmap) show a breadcrumb below the top nav indicating the current location. |
| FR-SHELL-006 | On mobile, the nav links collapse into a hamburger menu. |
| FR-SHELL-007 | Visiting an unknown route shows a 404 page with a link back to the dashboard. |

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-SHELL-001 | The shell layout does not re-mount on page navigation — only the page content area updates. |
| NFR-SHELL-002 | Navigating between pages shows a loading indicator if the next page takes more than 300ms to render. |
| NFR-SHELL-003 | The top nav is accessible via keyboard and screen reader (ARIA landmarks, focus management). |

## Out of Scope

- Profile & Settings page content (own epic if needed)
- Notification centre
- Search from the nav bar
