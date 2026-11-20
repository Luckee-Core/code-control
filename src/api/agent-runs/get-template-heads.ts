import type { TemplateHead } from './types';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** GET /api/data/agent-runs/template-heads (each template repo's default-branch commit) */
export const getTemplateHeads = () => requestJson<TemplateHead[]>(`${BASE}/template-heads`);
