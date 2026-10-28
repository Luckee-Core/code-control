# 032 – App layout header and breadcrumbs

## Status

Accepted

## Context

Operators need consistent chrome across list and detail screens: sidebar visibility, navigation context, and readable entity names in the breadcrumb trail.

## Decision

1. **Header** — `src/components/app-layout-header/` sits beside the main content; includes sidebar toggle (`PanelLeft` / `PanelLeftClose` from lucide-react), not a separate bordered “Dashboard” chip.

2. **Breadcrumb trail** — Plain text links and separators; show **full** entity names (no truncation for long ticket titles). Pending sibling selection uses a dropdown menu with scrollable panel per [017 – Floating menus and overflow](./017-floating-menus-and-overflow.md); menu UI lives in a dedicated subcomponent with local `styles`.

3. **Sidebar** — `src/components/sidebar/Sidebar.tsx` shares the dashboard gray border / active nav styling with list pages.

## Related

- [007 – Starter template layout](./007-starter-template-layout.md)
- [008 – Detail page routing](./008-detail-page-routing.md)
- [017 – Floating menus and overflow](./017-floating-menus-and-overflow.md)
