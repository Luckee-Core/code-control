import type { DataModelProposal } from '@/model/data-model-proposal';
import { requestJson } from '../request-json';
import type { DataModelProposalDetail } from './types';

export type * from './types';

const BASE = '/api/data/data-model-proposals';

/** GET /api/data/data-model-proposals?software_system_id= (newest version first) */
export const listDataModelProposals = (softwareSystemId: string) =>
  requestJson<DataModelProposal[]>(`${BASE}?software_system_id=${encodeURIComponent(softwareSystemId)}`);

/** GET /api/data/data-model-proposals/:id */
export const getDataModelProposal = (id: string) =>
  requestJson<DataModelProposalDetail>(`${BASE}/${encodeURIComponent(id)}`);

/** POST /api/data/data-model-proposals → 202 with the running proposal */
export const createDataModelProposal = (softwareSystemId: string, contextText: string) =>
  requestJson<DataModelProposal>(BASE, {
    method: 'POST',
    body: { software_system_id: softwareSystemId, context_text: contextText },
  });

/** POST /api/data/data-model-proposals/:id/revise → 202 with the new running version */
export const reviseDataModelProposal = (id: string, feedback: string) =>
  requestJson<DataModelProposal>(`${BASE}/${encodeURIComponent(id)}/revise`, {
    method: 'POST',
    body: { feedback },
  });

/** POST /api/data/data-model-proposals/:id/approve */
export const approveDataModelProposal = (id: string) =>
  requestJson<DataModelProposal>(`${BASE}/${encodeURIComponent(id)}/approve`, { method: 'POST' });

/** DELETE /api/data/data-model-proposals/:id */
export const deleteDataModelProposal = (id: string) =>
  requestJson<{ id: string }>(`${BASE}/${encodeURIComponent(id)}`, { method: 'DELETE' });
