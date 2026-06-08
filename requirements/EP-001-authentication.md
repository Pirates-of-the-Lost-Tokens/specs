# EP-001: Authentication

**Status:** Approved
**Type:** Epic

## Goal

All users must be authenticated to access LearnMap. New users complete a one-time onboarding step after their first sign-in.

## Functional Requirements

| ID | Requirement |
|---|---|
| FR-AUTH-001 | Every route in the app requires authentication. Unauthenticated requests redirect to `/login`. |
| FR-AUTH-002 | Users can sign in with Google or GitHub via OAuth. No email/password. |
| FR-AUTH-003 | After OAuth callback, new users are routed to `/onboarding`. Returning users go to `/dashboard`. |
| FR-AUTH-004 | Onboarding captures a display name (pre-filled from OAuth) and confirms the user's profile photo. |
| FR-AUTH-005 | Sessions persist across browser refreshes until expiry or explicit sign-out. |
| FR-AUTH-006 | Users can sign out from any page via a menu in the header. |
| FR-AUTH-007 | Expired or revoked sessions redirect to `/login` with a message. |

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-AUTH-001 | JWT stored in `httpOnly` cookie — not `localStorage` — to prevent XSS token theft. |
| NFR-AUTH-002 | OAuth `state` parameter validated on callback to prevent CSRF. |
| NFR-AUTH-003 | Auth endpoints respond within 500ms (p95). |

## Out of Scope

- Email/password authentication
- Multi-factor authentication
- Org/team membership (separate epic)
- Account deletion or deactivation
