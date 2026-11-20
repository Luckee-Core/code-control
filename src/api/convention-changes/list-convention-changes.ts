import type { ConventionChange } from '@/model/convention-change';
import { requestJson } from '../request-json';

export type ConventionChangesQuery = {
  convention_key?: string;
  domain_key?: string;
  role_key?: string;
  change_type?: string;
  source_type?: string;
  since?: string;
  limit?: number;
};

/** GET /api/data/conventions/changes (the convention change ledger, newest first) */
export const listConventionChanges = (query: ConventionChangesQuery = {}) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value !== undefined && value !== '') params.set(key, String(value));
  const search = params.toString();
  return requestJson<ConventionChange[]>(`/api/data/conventions/changes${search ? `?${search}` : ''}`);
};
