import type { AgentRun } from '@/model/agent-run';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** POST /api/data/agent-runs/:id/dismiss (drop a draft) */
export const dismissAgentRun = (id: string, note: string) =>
  requestJson<AgentRun>(`${BASE}/${encodeURIComponent(id)}/dismiss`, { method: 'POST', body: { note } });
