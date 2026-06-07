# ADR 017: QR codes — Redux-only detail routing

## Status

Accepted

## Context

The Operations **QR codes** feature adds a normalized `qrCodes` dump, a `qrCodesBuilder` slice for list UI (view toggle, modals, load status), and a `currentQrCode` slice for the row under inspection or edit.

Some features encode entity identity in the URL (`/things/[id]`, `?thingId=`). That pattern was explicitly rejected for QR codes.

## Decision

1. **List route:** `/qr-codes` — thin `app/(dashboard)/qr-codes/page.tsx` + `AppLayout` + `src/packages/qr-codes/`.
2. **Detail route:** a single static path **`/qr-code-detail-page`**. The detail package reads **`currentQrCode` only** from Redux. No `useSearchParams` and no dynamic segment under `/qr-codes/`.
3. **Opening detail:** dispatch `openQrCodeDetailThunk(id)` (loads the dump if needed, sets `currentQrCode`), then `router.push(QR_CODE_DETAIL_PAGE_PATH)` from the component—same sequencing as graphic projects + `GRAPHIC_PROJECT_DETAIL_PATH`.
4. **Builder:** holds primitives only (`view`, modal flags, `listLoadStatus`, `isSaving`, …). **Do not** store `editingQrCodeId` in the builder when `currentQrCode` already represents the row being edited in modals.
5. **Server data:** luckee-web calls **`API_CONFIG.SERVER_URL`** → `/api/data/qr-codes` on mentorai-server; CRUD is not done from the browser Supabase client for this table.

## Consequences

- Deep links to a specific QR code are not supported unless a future ADR adds a deliberate URL contract.
- Sidebar `activePathPrefix` must include **both** `QR_CODES_PATH` and `QR_CODE_DETAIL_PAGE_PATH` so Operations navigation stays highlighted on the detail page.

## References

- `src/config/routes.ts` — `QR_CODES_PATH`, `QR_CODE_DETAIL_PAGE_PATH`
- `src/store/thunks/qr-codes/openQrCodeDetailThunk.ts`
- `src/packages/qr-code-detail-page/index.tsx`
