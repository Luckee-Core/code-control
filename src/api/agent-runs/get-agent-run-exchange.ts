import type { AiExchange } from '@/model/agent-run';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** GET /api/data/agent-runs/:id/exchanges/:exchangeId (prompt and response bodies) */
export const getAgentRunExchange = (id: string, exchangeId: string) =>
  requestJson<AiExchange>(`${BASE}/${encodeURIComponent(id)}/exchanges/${encodeURIComponent(exchangeId)}`);
