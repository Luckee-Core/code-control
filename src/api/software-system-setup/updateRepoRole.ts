import type { SoftwareSystemRepo } from '@/model/software-system-repo';
import { requestJson } from '../request-json';

/** PATCH …/software-system-setup/repos/:repoId/role { role | null } */
export const updateRepoRole = (projectId: string, repoId: string, role: string | null) =>
  requestJson<SoftwareSystemRepo>(
    `/api/data/software-systems/${encodeURIComponent(projectId)}/software-system-setup/repos/${encodeURIComponent(repoId)}/role`,
    { method: 'PATCH', body: { role } },
  );
