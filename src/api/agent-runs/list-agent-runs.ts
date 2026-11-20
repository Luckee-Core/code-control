import type { AgentRunListItem, AgentRunsQuery } from './types';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** GET /api/data/agent-runs (filters: agent, status[], project, delivery, chain, template repo) */
export const listAgentRuns = (query: AgentRunsQuery = {}) => {
  const params = new URLSearchParams();
  if (query.agent) params.set('agent', query.agent);
  if (query.status && query.status.length > 0) params.set('status', query.status.join(','));
  if (query.software_system_id) params.set('software_system_id', query.software_system_id);
  if (query.delivery_id) params.set('delivery_id', query.delivery_id);
  if (query.root_run_id) params.set('root_run_id', query.root_run_id);
  if (query.limit) params.set('limit', String(query.limit));
  const search = params.toString();
  return requestJson<AgentRunListItem[]>(`${BASE}${search ? `?${search}` : ''}`);
};
