import type { AgentRun } from '@/model/agent-run';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** POST /api/data/agent-runs/:id/confirm (draft → running; template drafts may narrow scope) */
export const confirmAgentRun = (id: string, body: { instructions?: string; scope_change_ids?: string[] }) =>
  requestJson<AgentRun>(`${BASE}/${encodeURIComponent(id)}/confirm`, { method: 'POST', body });
