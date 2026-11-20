import type { AgentRunDetail } from './types';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** GET /api/data/agent-runs/:id (run, lineage, versions, hand-offs, AI calls, agent data) */
export const getAgentRunDetail = (id: string) => requestJson<AgentRunDetail>(`${BASE}/${encodeURIComponent(id)}`);
