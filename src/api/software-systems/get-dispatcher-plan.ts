import type { DispatcherPlan } from '@/model/dispatcher-plan';
import { requestJson } from '../request-json';

/** GET /api/data/software-systems/:id/dispatcher-plan — ids, ports, repos, folders, secrets and exposed paths. */
export const getSoftwareSystemDispatcherPlan = (softwareSystemId: string) =>
  requestJson<DispatcherPlan>(`/api/data/software-systems/${encodeURIComponent(softwareSystemId)}/dispatcher-plan`);
