import type { DataModelDelivery } from '@/model/data-model-delivery';
import { requestJson } from '../request-json';
import type { DeliveryPreview, DeliveryRole, DeliveryTarget } from './types';

export type * from './types';

const BASE = '/api/data/data-model-deliveries';

/** GET /api/data/data-model-deliveries?proposal_id= (one entry per role: storage, express, web) */
export const listDataModelDeliveries = (proposalId: string) =>
  requestJson<DeliveryTarget[]>(`${BASE}?proposal_id=${encodeURIComponent(proposalId)}`);

/** GET /api/data/data-model-deliveries/preview?proposal_id=&role= (renders, writes nothing) */
export const previewDataModelDelivery = (proposalId: string, role: DeliveryRole) =>
  requestJson<DeliveryPreview>(`${BASE}/preview?proposal_id=${encodeURIComponent(proposalId)}&role=${role}`);

/** POST /api/data/data-model-deliveries { proposal_id, roles?, auto_merge }: one PR per repo, optionally squash-merged */
export const deliverDataModel = (proposalId: string, roles: DeliveryRole[] | undefined, autoMerge: boolean) =>
  requestJson<DeliveryTarget[]>(BASE, {
    method: 'POST',
    body: { proposal_id: proposalId, auto_merge: autoMerge, ...(roles ? { roles } : {}) },
  });

/** POST /api/data/data-model-deliveries/:id/refresh (re-reads the PR state) */
export const refreshDataModelDelivery = (id: string) =>
  requestJson<DataModelDelivery>(`${BASE}/${encodeURIComponent(id)}/refresh`, { method: 'POST' });
