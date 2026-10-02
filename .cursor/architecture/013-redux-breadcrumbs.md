# 013 – Redux breadcrumbs

## Status

Accepted

## Context

Code Control renders a breadcrumb bar in `MainContent`. The trail must be serializable Redux state (no React nodes or functions). Package screens own the trail; thin `src/app/**/page.tsx` files do not.

## Decision

1. **`layoutBuilder`** (`src/store/builders/layout-builder.ts`) holds `breadcrumbs: { label: string; href?: string }[]` plus sidebar flags. Primitives and serializable objects only.
2. **`useBreadcrumbs`** (`src/hooks/use-breadcrumbs.ts`) dispatches `LayoutBuilderActions.setBreadcrumbs` on mount and `[]` on unmount. It does not wrap other thunks.
3. **Package ownership**: each feature `src/packages/{feature}/index.tsx` calls `useBreadcrumbs`. App pages do not.
4. **Presentation**: `src/components/breadcrumbs/` reads the whole `layoutBuilder` slice and renders the trail.

## Related

- [001 – Redux patterns](./001-redux-patterns.md)
- [002 – Component composition](./002-component-composition.md)
