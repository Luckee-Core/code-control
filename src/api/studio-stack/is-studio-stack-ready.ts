import type { HealthResponse } from '@/api/health';

/**
 * Single success metric for Home: Express GET /api/health body (`processGetHealth`).
 * Do not infer readiness from workspace CRUD loads.
 */
export const isStudioStackReady = (data: HealthResponse): boolean => {
  return data.status === 'ok';
};
