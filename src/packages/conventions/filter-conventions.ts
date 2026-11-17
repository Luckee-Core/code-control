import type { Convention } from '@/model/convention';
import type { ConventionRole } from '@/model/convention-role';

export type ConventionFilterState = {
  search: string;
  topicKey: string;
  roleKey: string;
  severity: string;
  status: string;
};

export const EMPTY_CONVENTION_FILTERS: ConventionFilterState = {
  search: '',
  topicKey: '',
  roleKey: '',
  severity: '',
  status: '',
};

/**
 * Applies the list filter bar to conventions (search covers key, title and statement).
 */
export const filterConventions = (
  conventions: Convention[],
  roleLinks: ConventionRole[],
  filters: ConventionFilterState,
): Convention[] => {
  const query = filters.search.trim().toLowerCase();
  const withRole = filters.roleKey
    ? new Set(roleLinks.filter((link) => link.role_key === filters.roleKey).map((link) => link.convention_id))
    : null;

  return conventions.filter((convention) => {
    if (filters.topicKey && convention.topic_key !== filters.topicKey) return false;
    if (filters.severity && convention.severity !== filters.severity) return false;
    if (filters.status && convention.status !== filters.status) return false;
    if (withRole && !withRole.has(convention.id)) return false;
    if (!query) return true;
    return [convention.key, convention.title, convention.statement].join(' ').toLowerCase().includes(query);
  });
};
