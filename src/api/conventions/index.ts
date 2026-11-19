import type { Convention, ConventionStatus } from '@/model/convention';
import type { ConventionExample } from '@/model/convention-example';
import type { ConventionSource } from '@/model/convention-source';
import { requestJson } from '../request-json';
import type {
  ConventionDetail,
  ConventionsCatalog,
  ConventionsContext,
  CreateConventionExamplePayload,
  CreateConventionSourcePayload,
  SaveConventionPayload,
} from './types';

export type * from './types';

const BASE = '/api/data/conventions';

/** GET /api/data/conventions (all; filtering happens client-side). */
export const listConventions = () => requestJson<Convention[]>(BASE);

/** GET /api/data/conventions/catalog */
export const getConventionsCatalog = () => requestJson<ConventionsCatalog>(`${BASE}/catalog`);

/** GET /api/data/conventions/:id */
export const getConventionDetail = (id: string) =>
  requestJson<ConventionDetail>(`${BASE}/${encodeURIComponent(id)}`);

/** GET /api/data/conventions/context?domain&role */
export const getConventionsContext = (domainKey: string, roleKey: string | null) => {
  const params = new URLSearchParams({ domain: domainKey });
  if (roleKey) params.set('role', roleKey);
  return requestJson<ConventionsContext>(`${BASE}/context?${params.toString()}`);
};

/** POST /api/data/conventions */
export const createConvention = (payload: SaveConventionPayload) =>
  requestJson<ConventionDetail>(BASE, { method: 'POST', body: payload });

/** PATCH /api/data/conventions/:id */
export const updateConvention = (id: string, payload: Partial<SaveConventionPayload>) =>
  requestJson<ConventionDetail>(`${BASE}/${encodeURIComponent(id)}`, { method: 'PATCH', body: payload });

/** PATCH /api/data/conventions/:id with only a status change. */
export const setConventionStatus = (id: string, status: ConventionStatus) =>
  requestJson<ConventionDetail>(`${BASE}/${encodeURIComponent(id)}`, { method: 'PATCH', body: { status } });

/** DELETE /api/data/conventions/:id */
export const deleteConvention = (id: string) =>
  requestJson<{ id: string }>(`${BASE}/${encodeURIComponent(id)}`, { method: 'DELETE' });

/** POST /api/data/conventions/:id/examples */
export const createConventionExample = (conventionId: string, payload: CreateConventionExamplePayload) =>
  requestJson<ConventionExample>(`${BASE}/${encodeURIComponent(conventionId)}/examples`, {
    method: 'POST',
    body: payload,
  });

/** DELETE /api/data/conventions/examples/:exampleId */
export const deleteConventionExample = (exampleId: string) =>
  requestJson<{ id: string }>(`${BASE}/examples/${encodeURIComponent(exampleId)}`, { method: 'DELETE' });

/** POST /api/data/conventions/:id/sources */
export const createConventionSource = (conventionId: string, payload: CreateConventionSourcePayload) =>
  requestJson<ConventionSource>(`${BASE}/${encodeURIComponent(conventionId)}/sources`, {
    method: 'POST',
    body: payload,
  });

/** DELETE /api/data/conventions/sources/:sourceId */
export const deleteConventionSource = (sourceId: string) =>
  requestJson<{ id: string }>(`${BASE}/sources/${encodeURIComponent(sourceId)}`, { method: 'DELETE' });

// AI-context preview and snapshots (used by the /ai-context page).
export { getConventionOptions } from './get-convention-options';
export { previewAiContext } from './preview-ai-context';
export { createAiContextSnapshot } from './create-ai-context-snapshot';
export { getConventionSnapshots } from './get-convention-snapshots';
export { getConventionSnapshot } from './get-convention-snapshot';
