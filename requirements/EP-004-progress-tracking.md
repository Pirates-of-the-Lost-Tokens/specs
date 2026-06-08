# EP-004: Progress Tracking

**Status:** Approved
**Type:** Epic

## Goal

Users have a personal dashboard showing their progress across all enrolled roadmaps, with enough detail to understand what they've done and what to do next.

## Functional Requirements

| ID | Requirement |
|---|---|
| FR-PROG-001 | The dashboard is the default landing page after login. It lists all enrolled roadmaps with a progress bar and completion percentage for each. |
| FR-PROG-002 | Each roadmap on the dashboard shows a topic count breakdown: Done / In Progress / Skipped / Not Started. |
| FR-PROG-003 | The dashboard shows a summary strip at the top: total roadmaps enrolled, total topics completed across all roadmaps. |
| FR-PROG-004 | A "Continue" button on each dashboard card deep-links back to the roadmap viewer, reopening the last topic the user had open. |
| FR-PROG-005 | The dashboard shows a "Recently completed" section listing the last 5 topics the user marked as Done, with the roadmap name and timestamp. |
| FR-PROG-006 | Progress is persisted server-side and consistent across devices and sessions. |
| FR-PROG-007 | Users can reset progress on a roadmap from the dashboard. A confirmation prompt warns that all topic statuses for that roadmap will be cleared. |

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-PROG-001 | Topic status changes are persisted within 1s. |
| NFR-PROG-002 | Dashboard loads within 1.5s (p95). |

## Out of Scope

- Viewing teammates' progress (EP-006)
- Streaks, badges, or gamification
- Progress export or reporting
