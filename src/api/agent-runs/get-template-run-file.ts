import type { TemplateFile } from './types';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** GET /api/data/agent-runs/:id/template-file?repo=&path=&at=base|head */
export const getTemplateRunFile = (id: string, repo: string, path: string, at: 'base' | 'head') =>
  requestJson<TemplateFile>(`${BASE}/${encodeURIComponent(id)}/template-file?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}&at=${at}`);
