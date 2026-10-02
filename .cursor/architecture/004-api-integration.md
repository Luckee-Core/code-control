# 004 - API Integration Patterns (Next.js)

## Objective

Define one consistent API integration pattern for this Code Control Next.js app so data flow, typing, and error handling are predictable.

## Required Rules

1. **API functions live in `src/api/{domain}/` only.**
2. **All API boundaries return `ApiResponse<T>`.**
3. **Components never call API functions directly. Components dispatch thunks; thunks call API functions.**
4. **Error handling must be explicit and status-code driven.**
5. **JSDoc is required on every exported API function.**

---

## 1) File and Ownership Pattern

This app talks to the companion **Express** server. It does **not** add `src/app/api/**/route.ts` handlers. Next.js rewrites `/api/*` to Express (see `next.config.ts`). Browser HTTP uses `getApiBaseUrl()` so the same-origin rewrite applies.

```text
src/
  api/
    types.ts
    config.ts
    customers/
      get-all.ts
      create.ts
      index.ts
    projects/
      get-all.ts
      create.ts
      index.ts
  store/
    thunks/
      customers/
        get-all-customers-thunk.ts
```

- `src/api/{domain}/`: one outbound HTTP function per kebab-case file.
- `src/store/thunks/**`: the **only** client-side layer allowed to call `src/api/**`.
- Do **not** add Next.js route handlers unless this ADR is amended.

---

## 2) `ApiResponse<T>` Contract

Express returns `{ success, data?, error? }`. Clients use that shape:

```ts
// src/api/types.ts
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
};
```

---

## 3) JSDoc on exported API functions

```ts
/**
 * Fetches every customer from Express.
 */
export const getAllCustomers = async (
  apiBaseUrl?: string
): Promise<ApiResponse<Customer[]>> => {
  // ...
};
```

---

## 4) Thunk-Only API Access

### Correct: Component -> Thunk -> API

```ts
export const getAllCustomersThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    const result = await getAllCustomers(getApiBaseUrl());
    if (!result.success || !result.data) {
      return 500;
    }
    dispatch(CustomersActions.setCustomers(result.data));
    return 200;
  };
```

```tsx
useEffect(() => {
  void dispatch(getAllCustomersThunk());
}, [dispatch]);
```

### Incorrect: Component calls API directly

```tsx
useEffect(() => {
  void getAllCustomers();
}, []);
```

---

## 5) Pairing with Express

1. Add **`src/api/{domain}/`** modules that return `ApiResponse<T>`; call them from **thunks** only.
2. Prefer **`CODE_CONTROL_API_URL`** / **`NEXT_PUBLIC_CODE_CONTROL_API_URL`** in `src/api/config.ts` and Next rewrites; never embed secrets in client bundles.
3. Wire contract from Express stays `{ success, data?, error? }` unless you amend this ADR.

## Related

- [001 – Redux patterns](./001-redux-patterns.md)
- [010 – Public content reads from Express](./010-public-blog-express-fetch.md)
