import type { AgentRun } from '@/model/agent-run';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** PATCH /api/data/agent-runs/:id (draft only: instructions, PR feedback, focus files) */
export const updateAgentRunDraft = (id: string, body: { instructions?: string; feedback?: string; focus_paths?: string[] }) =>
  requestJson<AgentRun>(`${BASE}/${encodeURIComponent(id)}`, { method: 'PATCH', body });
