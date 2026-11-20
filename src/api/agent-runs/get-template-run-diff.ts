import type { TemplateDiffFile } from './types';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** GET /api/data/agent-runs/:id/template-diff?repo=&scope=pr|run (one template repo's PR) */
export const getTemplateRunDiff = (id: string, repo: string, scope: 'pr' | 'run') =>
  requestJson<TemplateDiffFile[]>(`${BASE}/${encodeURIComponent(id)}/template-diff?repo=${encodeURIComponent(repo)}&scope=${scope}`);
