import type { RecentSoftwareSystemOpen } from '@/model/software-system-open';
import { requestJson } from '../request-json';

/** GET /api/data/software-systems/recent-opens?limit= — newest first, one row per system */
export const getRecentSoftwareSystemOpens = (limit: number) =>
  requestJson<RecentSoftwareSystemOpen[]>(`/api/data/software-systems/recent-opens?limit=${limit}`);
