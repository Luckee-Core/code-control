# 035 – List and dashboard table filter bars

## Status

Accepted

## Context

Operators need consistent search and narrowing on every CRM table. Tickets already use a filter section above the table; other list routes, nested detail tabs, and dashboard widget tables were inconsistent or missing filters entirely.

## Decision

1. **Filter section placement** — Any package-owned **data table** (top-level list route, project/customer detail tab, or dashboard widget table) renders a filter strip **immediately above** the table body (inside the panel for dashboard widgets). Tickets kanban shares the page-level tickets filter bar. Time-tracking calendar uses the same bar shell for its week/project toolbar.

2. **Visual contract** — Use `listFilterBarStyles` from `src/components/list-filter-bar-styles.ts` for the outer `section` (and shared search input tokens where applicable). Table chrome remains `border-gray-300`, `bg-gray-100` headers, `text-xs` cells (see [031](./031-dashboard-operating-view.md)).

3. **Package layout** — List packages add `filters/index.tsx` and optional `filters/inputs/{field}/index.tsx` per [012](./012-package-form-inputs.md). Pure filter functions live in `src/packages/{feature}/filter-*.ts` (not `src/utils/{table}/`).

4. **Redux** — Persist list filters in `src/store/filters/` slices (`customersFilters`, `projectsFilters`, etc.). Tab-scoped project detail search fields may live on `currentProjectDetail`. Customer detail tab search uses `customerDetailFilters`. Dashboard widgets use one `dashboardTableFilters` slice with namespaced fields. New list filters use **live** `searchTerm` updates unless a product ADR requires an Apply button (tickets `hasQueried` is historical).

5. **Exclusions** — `section-kit` document editor tables; `estimate-settings` form page; dashboard KPI/metrics strip (not a table).

## Related

- [005 – File organization](./005-file-organization.md)
- [012 – Package form inputs](./012-package-form-inputs.md)
- [031 – Dashboard operating view](./031-dashboard-operating-view.md)
- [033 – Detail page layout chrome](./033-detail-page-layout-chrome.md)
