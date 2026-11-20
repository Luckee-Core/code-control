import type { AgentRun } from '@/model/agent-run';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** POST /api/data/agent-runs/:id/retry (failed → running) */
export const retryAgentRun = (id: string) => requestJson<AgentRun>(`${BASE}/${encodeURIComponent(id)}/retry`, { method: 'POST' });
