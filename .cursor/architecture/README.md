# Architecture Documentation

This folder contains Architecture Decision Records (ADRs) for the **Code Control** Next.js web app.

> Forked from luckee-web. Product-specific ADRs (007, 016, 017) may not apply to Code Control — prefer 001–006 and 008.

## Why ADRs?

ADRs keep implementation consistent by documenting:

- **What** standard we follow
- **Why** we chose it
- **How** to apply it in everyday development

## ADR index (on-disk)

### Shared conventions (001–006, 008, 010)

1. [001 – Redux patterns](./001-redux-patterns.md) — Flat layers, manual thunks.
2. [002 – Component composition](./002-component-composition.md) — Thin app routes, `src/packages/`.
3. [003 – Styling rules](./003-styling-rules.md) — Styles object + template literals.
4. [004 – API integration](./004-api-integration.md) — `src/api/` clients, thunks only.
5. [005 – File organization](./005-file-organization.md) — kebab-case, barrel exports.
6. [006 – Constants and utilities](./006-constants-utilities.md) — Pure utilities.
8. [008 – Detail page routing](./008-detail-page-routing.md) — `{entity}-detail-page`, no `[id]` routes; Redux `current*`.
10. [010 – Public content reads from Express](./010-public-blog-express-fetch.md) — Server Component reads + Redux list hydration.

### Product-specific

7. [007 – Redux dashboard breadcrumbs](./007-redux-dashboard-breadcrumbs.md) — Serializable trail, resolver hook.
16. [016 – Standalone chat studio UI contract](./016-standalone-chat-studio-ui-contract.md) — Inline two-pane shell.
17. [017 – QR codes Redux detail routing](./017-qr-codes-redux-detail-routing.md) — QR detail via `current*`.

## How to use

1. Open the ADR most relevant to your feature.
2. Follow the approved patterns in implementation.
3. Add new ADRs here whenever architectural decisions change—and **update this index** when you do.
