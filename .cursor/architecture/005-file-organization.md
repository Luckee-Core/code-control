# 005 - File Organization (Next.js)

## Status
Accepted

## Context
This ADR defines the required file-organization standard for **luckee-web** so module ownership, exports, and imports stay predictable as the codebase grows.

## Decision

### 1) Canonical folder structure
All feature and shared code must follow this structure under `src/`:

```text
src/
  app/          # Next.js routes, layouts, pages, and route handlers
  packages/     # feature packages (domain-owned code)
  components/   # cross-feature reusable UI
  utils/        # pure utilities and shared constants
  store/        # Redux store, slices, selectors, thunks
  api/          # API clients/services and API contracts
```

✅ **Do**
```text
src/app/orders/page.tsx
src/packages/orders/ui/OrdersTable.tsx
src/components/Button.tsx
src/utils/date/formatDate.ts
src/store/orders/orders.slice.ts
src/api/orders/orders.client.ts
```

❌ **Don't**
```text
src/features/orders/*
src/lib/helpers/*
src/state/*
src/services/*
```

---

### 2) One function or component per file; kebab-case filenames
Each file must own one primary function or one primary React component. File names use **kebab-case** (e.g. `load-jobs-thunk.ts`, `job-list-row.tsx`).

✅ **Do**
```ts
// src/utils/orders/normalize-order.ts
export const normalizeOrder = (input: OrderDto): Order => ({
  id: input.id,
  status: input.status,
});
```

```ts
// src/store/thunks/crm/load-jobs-thunk.ts
export const loadJobsThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch) => {
  // ...
};
```

❌ **Don't**
```ts
// src/utils/orders/orderHelpers.ts — multiple exports in one file
export const normalizeOrder = (input: OrderDto): Order => ({ ... });
export const isOrderOpen = (status: Order["status"]): boolean => status === "OPEN";
```

---

### 3) Use `type`, not `interface`
For consistency across the codebase, use `type` for object shapes and props.

✅ **Do**
```ts
type Job = {
  id: string;
  title: string;
};
```

❌ **Don't**
```ts
interface Job {
  id: string;
  title: string;
}
```

---

### 4) Barrel exports are required (`index.ts` in every folder)
Every folder in `packages/`, `components/`, `utils/`, `store/`, and `api/` must include an `index.ts` that re-exports the folder's public API.

✅ **Do**
```text
src/packages/orders/
  index.ts
  OrdersPage.tsx
  ui/
    index.ts
    OrdersTable.tsx
```

```ts
// src/packages/orders/index.ts
export { OrdersPage } from "./OrdersPage";
export * from "./ui";
```

❌ **Don't**
```text
src/packages/orders/
  OrdersPage.tsx
  ui/
    OrdersTable.tsx
```

```ts
// Missing barrel forces deep imports everywhere:
import { OrdersTable } from "@/packages/orders/ui/OrdersTable";
```

---

### 5) Named exports only
Use named exports everywhere. `default` exports are forbidden **except** Next.js page files (`src/app/**/page.tsx`), where Next.js requires default export.

✅ **Do**
```ts
// src/components/Button.tsx
type ButtonProps = {
  label: string;
};

export const Button = ({ label }: ButtonProps) => {
  return <button className={styles.button}>{label}</button>;
};
```

```tsx
// src/app/orders/page.tsx (allowed default export)
import { OrdersPage } from "@/packages/orders";

export default function Page() {
  return <OrdersPage />;
}
```

❌ **Don't**
```ts
// src/components/Button.tsx
export default function Button() {
  return <button>Save</button>;
}
```

---

### 6) Import boundaries
Consumers must import through folder barrels (`index.ts`) instead of deep relative paths.

✅ **Do**
```ts
import { OrdersPage } from "@/packages/orders";
import { Button } from "@/components";
import { normalizeOrder } from "@/utils/orders";
```

❌ **Don't**
```ts
import { OrdersPage } from "@/packages/orders/OrdersPage";
import { Button } from "@/components/Button";
import { normalizeOrder } from "@/utils/orders/normalizeOrder";
```

## Consequences
- Clear ownership per folder (`app`, `packages`, `components`, `utils`, `store`, `api`).
- Smaller files with one responsibility and easier review/testing.
- Stable import paths through barrel exports.
- Consistent export style with fewer refactor breaks.
