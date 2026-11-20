import type { AgentRunSummary } from './types';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** GET /api/data/agent-runs/summary (open runs per agent; waiting = draft + needs review) */
export const getAgentRunSummary = () => requestJson<AgentRunSummary>(`${BASE}/summary`);
