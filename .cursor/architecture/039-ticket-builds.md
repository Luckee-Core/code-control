# 039 – Ticket builds UI

## Status

Accepted.

## Context

Express ADR 011 adds ticket builds (ops ticket → reviewed plan → one PR per repo). The web needs an entry point from My Ops Tracker, a review screen and a list per software system.

## Decision

- **Routes:** `/ticket-build-start-page` (entry from My Ops Tracker: `?opsTicketId=` creates or opens the ticket's active build; `?buildId=` opens a build; if no software system matches, a picker) and `/ticket-build-detail-page` (static detail page; the build lives in `currentTicketBuild`).
- **Detail page:** summary card (ops ticket, system, status, model/tokens, Revise… and Approve & build), plan panel (summary, missing-roles note, shared contract textarea, one card per repo with role, include toggle, plan textarea, PR link/status), collapsed AI calls. Edits save on blur and only while `plan_ready`. Polls every 5 s while planning or building.
- **Software system → "Ticket builds" tab** lists the system's builds; a row opens the detail page.
- **State:** dumps `ticketBuilds`, `ticketBuildRepos`, `ticketBuildAiExchanges`; `currentTicketBuild` (object); `ticketBuildBuilder` (submit status/error, feedback draft, revise open, list loading). Thunks in `store/thunks/ticket-builds/` are the only callers of `src/api/ticket-builds`.

## Consequences

The ops ticket page links here for review; status shown in My Ops Tracker comes from Code Control storage and is refreshed when this page polls.
