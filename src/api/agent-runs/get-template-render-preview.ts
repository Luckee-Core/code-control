import type { RenderPreview } from './types';
import { requestJson } from '../request-json';

const BASE = '/api/data/agent-runs';

/** GET /api/data/agent-runs/:id/render-preview?repo= (generated code before/after one repo's template PR) */
export const getTemplateRenderPreview = (id: string, repo: string) =>
  requestJson<RenderPreview>(`${BASE}/${encodeURIComponent(id)}/render-preview?repo=${encodeURIComponent(repo)}`);
