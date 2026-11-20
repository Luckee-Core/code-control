import type { ConventionChange } from '@/model/convention-change';
import { requestJson } from '../request-json';

/** GET /api/data/conventions/:id/changes (one convention's history, newest first) */
export const listConventionChangesForConvention = (conventionId: string) =>
  requestJson<ConventionChange[]>(`/api/data/conventions/${encodeURIComponent(conventionId)}/changes`);
