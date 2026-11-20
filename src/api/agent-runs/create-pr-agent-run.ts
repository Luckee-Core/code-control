import type { AgentRun } from '@/model/agent-run';
import { requestJson } from '../request-json';

/** POST /api/data/data-model-deliveries/:id/pr-agent-runs (Update PR → PR agent draft, or run now) */
export const createPrAgentRun = (deliveryId: string, body: { feedback: string; focus_paths: string[]; run_now: boolean }) =>
  requestJson<AgentRun>(`/api/data/data-model-deliveries/${encodeURIComponent(deliveryId)}/pr-agent-runs`, { method: 'POST', body });
