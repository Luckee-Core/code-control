import type { AgentRun } from '@/model/agent-run';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** POST /api/data/agent-runs/:id/reject (ends the chain; template runs can revert their changes) */
export const rejectAgentRun = (id: string, body: { note: string; revert_changes?: boolean }) =>
  requestJson<{ run: AgentRun; reverted?: number; notes?: string[] }>(`${BASE}/${encodeURIComponent(id)}/reject`, { method: 'POST', body });
