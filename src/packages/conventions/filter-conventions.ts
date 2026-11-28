import type { Convention } from '@/model/convention';
import type { ConventionRole } from '@/model/convention-role';
import type { ConventionTopic } from '@/model/convention-topic';
import type { ConventionsFiltersState } from '@/store/filters';

/**
 * Topic names for the filter: each name once, A–Z.
 */
export const listTopicNames = (topics: ConventionTopic[]): string[] =>
  [...new Set(topics.map((topic) => topic.name))].sort((a, b) => a.localeCompare(b));

/**
 * Applies the list filter bar to conventions (search covers key, title and statement).
 */
export const filterConventions = (
  conventions: Convention[],
  topics: ConventionTopic[],
  roleLinks: ConventionRole[],
  filters: ConventionsFiltersState,
): Convention[] => {
  const query = filters.searchTerm.trim().toLowerCase();
  const withTopic = filters.topicName
    ? new Set(topics.filter((topic) => topic.name === filters.topicName).map((topic) => topic.key))
    : null;
  const withRole = filters.roleKey
    ? new Set(roleLinks.filter((link) => link.role_key === filters.roleKey).map((link) => link.convention_id))
    : null;

  return conventions.filter((convention) => {
    if (withTopic && !withTopic.has(convention.topic_key)) return false;
    if (filters.severity && convention.severity !== filters.severity) return false;
    if (filters.status && convention.status !== filters.status) return false;
    if (withRole && !withRole.has(convention.id)) return false;
    if (!query) return true;
    return [convention.key, convention.title, convention.statement].join(' ').toLowerCase().includes(query);
  });
};
