import type { DataModelDelivery, DataModelDeliveryKind } from '@/model/data-model-delivery';
import { requestJson } from '../request-json';
import type { DeliveryPreview, DeliveryRole, DeliveryTarget } from './types';

export type * from './types';

const BASE = '/api/data/data-model-deliveries';

/** GET /api/data/data-model-deliveries?proposal_id=&kind= (one entry per role: storage, express, web) */
export const listDataModelDeliveries = (proposalId: string, kind: DataModelDeliveryKind) =>
  requestJson<DeliveryTarget[]>(`${BASE}?proposal_id=${encodeURIComponent(proposalId)}&kind=${kind}`);

/** GET /api/data/data-model-deliveries/preview?proposal_id=&role=&kind= (renders, writes nothing) */
export const previewDataModelDelivery = (proposalId: string, kind: DataModelDeliveryKind, role: DeliveryRole) =>
  requestJson<DeliveryPreview>(`${BASE}/preview?proposal_id=${encodeURIComponent(proposalId)}&role=${role}&kind=${kind}`);

/** POST /api/data/data-model-deliveries { proposal_id, kind, roles?, auto_merge }: one PR per repo, optionally squash-merged */
export const deliverDataModel = (
  proposalId: string,
  kind: DataModelDeliveryKind,
  roles: DeliveryRole[] | undefined,
  autoMerge: boolean,
) =>
  requestJson<DeliveryTarget[]>(BASE, {
    method: 'POST',
    body: { proposal_id: proposalId, kind, auto_merge: autoMerge, ...(roles ? { roles } : {}) },
  });

/** POST /api/data/data-model-deliveries/:id/refresh (re-reads the PR state) */
export const refreshDataModelDelivery = (id: string) =>
  requestJson<DataModelDelivery>(`${BASE}/${encodeURIComponent(id)}/refresh`, { method: 'POST' });
