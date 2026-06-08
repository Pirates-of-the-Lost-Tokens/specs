# EP-005: Custom Roadmap Builder

**Status:** Approved
**Type:** Epic

## Goal

Any authenticated user can create their own roadmap using a visual canvas builder and publish it for enrolment by all authenticated users.

## Functional Requirements

| ID | Requirement |
|---|---|
| FR-BUILD-001 | Any authenticated user can create a new roadmap from the catalog page or dashboard. |
| FR-BUILD-002 | Creating or editing a roadmap opens a visual canvas builder. |
| FR-BUILD-003 | Users can add, rename, reposition, and delete topic nodes on the canvas. |
| FR-BUILD-004 | Users can connect topic nodes with directional edges to indicate progression. |
| FR-BUILD-005 | Users can group topics into named sections on the canvas. |
| FR-BUILD-006 | Users can set the roadmap title, description, and tags. |
| FR-BUILD-007 | Users can add a description and resources (URL, title, type: article / video / course) to each topic. |
| FR-BUILD-008 | The builder auto-saves the roadmap as a draft every 30 seconds and on any explicit save action. |
| FR-BUILD-009 | Users can publish a draft roadmap. Published roadmaps are visible to all authenticated users in the catalog and available for enrolment. |
| FR-BUILD-010 | Users can unpublish a roadmap. Unpublished roadmaps are removed from the catalog but enrolled users retain their progress. |
| FR-BUILD-011 | Users can edit their own published roadmaps. Structural changes (adding/removing topics) take effect immediately for enrolled users. |
| FR-BUILD-012 | Users can delete their own roadmaps. Deletion requires confirmation and permanently removes all enrolments and progress for that roadmap. |
| FR-BUILD-013 | Users can duplicate any roadmap (including seeded ones) as a starting point for a new one. The duplicate is owned by the duplicating user and starts as a draft. |
| FR-BUILD-014 | Seeded roadmaps cannot be structurally edited by regular users. Admin resource editing (FR-VIEW-012) is separate from the builder. |

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-BUILD-001 | Builder supports roadmaps with up to 200 nodes without degraded performance. |
| NFR-BUILD-002 | Auto-save completes within 1s and does not interrupt the user's editing flow. |

## Out of Scope

- Sharing roadmaps with specific users or teams (EP-006)
- Importing roadmaps from external formats
- Version history and rollback
