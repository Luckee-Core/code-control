import type { AiCostCall } from '@/model/ai-cost-call';
import { requestJson } from '../request-json';

/** GET /api/data/software-systems/:id/ai-calls — every AI call made for the system, newest first. */
export const getSoftwareSystemAiCalls = (softwareSystemId: string) =>
  requestJson<AiCostCall[]>(`/api/data/software-systems/${encodeURIComponent(softwareSystemId)}/ai-calls`);
