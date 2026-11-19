import type { TicketBuild } from '@/model/ticket-build';
import type { TicketBuildAiExchangeSummary } from '@/model/ticket-build-ai-exchange';
import type { TicketBuildRepo } from '@/model/ticket-build-repo';
import { requestJson } from '../request-json';

const BASE = '/api/data/ticket-builds';

/** POST /api/data/ticket-builds { ops_ticket_id, software_system_id? } — planning build (or the active one) */
export const createTicketBuild = (opsTicketId: string, softwareSystemId: string | null) =>
  requestJson<TicketBuild>(BASE, {
    method: 'POST',
    body: { ops_ticket_id: opsTicketId, ...(softwareSystemId ? { software_system_id: softwareSystemId } : {}) },
  });

/** GET /api/data/ticket-builds?software_system_id= */
export const listTicketBuildsBySoftwareSystemId = (softwareSystemId: string) =>
  requestJson<TicketBuild[]>(`${BASE}?software_system_id=${encodeURIComponent(softwareSystemId)}`);

/** GET /api/data/ticket-builds/:id — polling target (syncs agents and PRs) */
export const getTicketBuild = (id: string) => requestJson<TicketBuild>(`${BASE}/${encodeURIComponent(id)}`);

/** PATCH /api/data/ticket-builds/:id { contract_text } */
export const updateTicketBuildContract = (id: string, contractText: string) =>
  requestJson<TicketBuild>(`${BASE}/${encodeURIComponent(id)}`, { method: 'PATCH', body: { contract_text: contractText } });

/** POST /api/data/ticket-builds/:id/revise { feedback } */
export const reviseTicketBuild = (id: string, feedback: string) =>
  requestJson<TicketBuild>(`${BASE}/${encodeURIComponent(id)}/revise`, { method: 'POST', body: { feedback } });

/** POST /api/data/ticket-builds/:id/start — approve and start one Cursor agent per repo */
export const startTicketBuild = (id: string) =>
  requestJson<TicketBuild>(`${BASE}/${encodeURIComponent(id)}/start`, { method: 'POST' });

/** GET /api/data/ticket-build-repos?ticket_build_id= */
export const listTicketBuildRepos = (ticketBuildId: string) =>
  requestJson<TicketBuildRepo[]>(`/api/data/ticket-build-repos?ticket_build_id=${encodeURIComponent(ticketBuildId)}`);

/** PATCH /api/data/ticket-build-repos/:id { plan_text?, included? } */
export const updateTicketBuildRepo = (id: string, input: { planText?: string; included?: boolean }) =>
  requestJson<TicketBuildRepo>(`/api/data/ticket-build-repos/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: {
      ...(input.planText !== undefined ? { plan_text: input.planText } : {}),
      ...(input.included !== undefined ? { included: input.included } : {}),
    },
  });

/** GET /api/data/ticket-build-ai-exchanges?ticket_build_id= */
export const listTicketBuildAiExchanges = (ticketBuildId: string) =>
  requestJson<TicketBuildAiExchangeSummary[]>(
    `/api/data/ticket-build-ai-exchanges?ticket_build_id=${encodeURIComponent(ticketBuildId)}`,
  );
