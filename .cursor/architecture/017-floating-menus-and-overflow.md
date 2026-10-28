# 017 – Floating menus and overflow

## Status

Accepted

## Context

Custom dropdown and action menus use `absolute` or `fixed` positioning. They are clipped when an ancestor uses `overflow-hidden`, or when a horizontal scroll wrapper sets `overflow-x-auto` (browsers then treat vertical overflow as clipped as well). Native `<select>` elements are not covered here.

Table rows at the bottom of a scroll region are a common failure mode: the menu opens downward and is cut off by the table container.

## Decision

### 1) One component per custom menu

- Parents (table shells, filter bars, headers, rows) **import** a dedicated dropdown/input/actions component.
- Do not copy `<details>` + menu markup into `row/index.tsx` or filter composers.
- The dedicated module may use `<details>` internally.

### 2) Styles live in that component only

- Declare wrapper, backdrop, menu panel, and item classes in the same file’s `styles` object ([003 – Styling rules](./003-styling-rules.md)).
- **Forbidden:** shared class-string barrels such as `dropdown-overflow-styles.ts` under `src/components/` (or equivalent imports of menu token objects).

Copy these defaults into each module’s `styles` as needed (not a shared import):

| Role | Typical classes |
|------|-----------------|
| Menu panel | `max-h-60 overflow-y-auto overflow-x-hidden` plus border, shadow, padding |
| In-page menu z-index | Panel `z-50`; backdrop `fixed inset-0 z-40` |
| Portaled row menu z-index | Panel `fixed z-[70]`; backdrop `fixed inset-0 z-[60]` |
| Wrapper | `relative overflow-visible` |
| Align left | `absolute left-0 top-full mt-1` |
| Align right | `absolute right-0 top-full left-auto mt-1` |

Use a `<button type="button">` for the backdrop where possible ([016 – Interactive cursor](./016-interactive-cursor-affordance.md)).

### 3) Non-table placement

- Wrapper: `relative overflow-visible`.
- Menu: `absolute` under the trigger with the menu panel classes above.
- Panel shells (detail headers, dashboard sections) that host popovers: prefer `overflow-visible` on the outer panel; put `overflow-x-auto` only on an inner table scroll wrapper.

### 4) Table and scroll-container placement

- Menus opened from **table cells** (inline status, editors): **portal** the menu to `document.body`, use `position: fixed`, and set `top` / `left` from `getBoundingClientRect()`.
- Flip above the trigger when there is not enough viewport space below.
- Pure positioning math may live in `src/utils/dom/compute-floating-menu-position.ts` when used two or more times ([006 – Constants and utilities](./006-constants-utilities.md)); portal markup and class names stay in the component.

### 5) Row ellipsis action menus

- Use the same portaled `fixed` pattern when the row sits inside a clipped table or `overflow-x-auto` region.

### 6) File placement

- Feature UI under `src/packages/{feature}/`.
- Filter bar controls: `filters/inputs/{field}/index.tsx` per [012 – Package form inputs](./012-package-form-inputs.md).
- Ticket inline status: `packages/tickets/status-dropdown/index.tsx` (imported from table rows, dashboard attention queue, and ticket detail header).

### 7) Anti-patterns

- `overflow-hidden` on the **menu panel** (blocks internal scroll for long lists).
- Embedding custom menu markup in table rows or filter composers instead of an input component.
- Shared style token files for menu class strings.

## Related

- [003 – Styling rules](./003-styling-rules.md)
- [006 – Constants and utilities](./006-constants-utilities.md)
- [012 – Package form inputs](./012-package-form-inputs.md)
- [016 – Interactive cursor affordance](./016-interactive-cursor-affordance.md)
