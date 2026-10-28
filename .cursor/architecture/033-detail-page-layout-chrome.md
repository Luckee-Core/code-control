# 033 – Detail page layout chrome

## Status

Accepted

## Context

CRM detail screens should match list/dashboard table framing and use the full content width. Popovers (status, actions menus) must not be clipped by panel shells.

## Decision

1. **Shared styles** — `src/components/detail-page-styles.ts` exports `detailPageStyles` (page, panel, panelHeader, panelBody, buttons, field labels) for customer, project, ticket, estimate, and proposal detail packages.

2. **Full width** — Customer, project, ticket, estimate, and proposal detail routes use `AppLayout` with `fullWidth` (no centered `max-w-[1400px]` column). Breadcrumbs follow [032](./032-app-layout-header-and-breadcrumbs.md).

3. **Summary panel** — Top of each detail screen is a summary `detailPageStyles.panel`: `panelHeader` with title/meta on the left and an **ellipsis actions menu** on the right (canonical: project ticket detail header). Read-only fields in `panelBody`; edits via modals or lower tabs unless inline controls are product-required (e.g. ticket status).

4. **Panels** — Outer panel uses `overflow-visible` so floating menus are not clipped; table tabs keep `overflow-x-auto` on inner scroll wrappers only ([017](./017-floating-menus-and-overflow.md)).

## Related

- [002 – Component composition](./002-component-composition.md)
- [017 – Floating menus and overflow](./017-floating-menus-and-overflow.md)
- [030 – Project ticket detail and filters](./030-project-ticket-detail-and-filters.md)
