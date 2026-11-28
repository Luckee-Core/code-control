import type { SoftwareSystemOpen } from '@/model/software-system-open';
import { requestJson } from '../request-json';

/** POST /api/data/software-systems/:id/opens — records a detail-page open */
export const recordSoftwareSystemOpen = (id: string) =>
  requestJson<SoftwareSystemOpen>(`/api/data/software-systems/${encodeURIComponent(id)}/opens`, { method: 'POST' });
