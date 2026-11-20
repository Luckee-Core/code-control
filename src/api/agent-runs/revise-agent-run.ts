import type { AgentRun } from '@/model/agent-run';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** POST /api/data/agent-runs/:id/revise (new version with feedback; starts unless run_now is false) */
export const reviseAgentRun = (id: string, body: { feedback: string; run_now?: boolean }) =>
  requestJson<AgentRun>(`${BASE}/${encodeURIComponent(id)}/revise`, { method: 'POST', body });
