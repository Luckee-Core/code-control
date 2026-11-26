# 040 – Build all panel

## Status

Accepted.

## Context

Express ADR 012 adds build runs: one press delivers an approved data model through every tab in order, squash-merging each PR. The software system page needs the button, the progress and a way to resume.

## Decision

- **Where:** a "Build all" panel between the Overview card and the tabs on the software system detail page (`src/packages/software-system-detail-page/build-all/`). It shows the newest run: status badge, one row per step (`steps/index.tsx` + `steps/row/index.tsx`) with its status, note or error and PR links, and a collapsed log (`log/`). A step row opens its tab.
- **Actions:** Build all (needs an approved version; hidden while a run is running or paused), Continue (paused or failed), Cancel, Build again (after a run ends). Polls `GET /system-build-runs/:id` every 5 s while the run is running.
- **State:** dumps `systemBuildRuns`, `systemBuildRunSteps`, `systemBuildRunEvents`; builder `systemBuildRunBuilder` (loaded system, submit status/error, log open). The detail page's open tab moved from component state to `softwareSystemTabsBuilder.activeTab` so a step row can switch tabs; the page resets it when the software system changes. Thunks in `store/thunks/system-build-runs/` are the only callers of `src/api/system-build-runs`.

## Consequences

The tabs keep their own Deliver buttons; they reload deliveries when opened, so they show the PRs a run made.
