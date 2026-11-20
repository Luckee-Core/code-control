import type { AgentRun } from '@/model/agent-run';
import type { ConventionDecision } from './types';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** POST /api/data/agent-runs/:id/approve (applies the output; returns the next agent's drafts) */
export const approveAgentRun = (id: string, body: { note: string; decisions?: ConventionDecision[] }) =>
  requestJson<{ run: AgentRun; next: AgentRun[] }>(`${BASE}/${encodeURIComponent(id)}/approve`, { method: 'POST', body });
