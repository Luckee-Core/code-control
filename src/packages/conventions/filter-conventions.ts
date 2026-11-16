import type { Convention } from '@/model/convention';
import type { ConventionTopic } from '@/model/convention-topic';
import type { ConventionFilters } from './filters';

/**
 * Applies list filters and sorts like storage: topic order, then sort_order, then key.
 */
export const filterConventions = (
  conventions: Convention[],
  topics: ConventionTopic[],
  filters: ConventionFilters
): Convention[] => {
  const topicOrder = new Map(topics.map((topic, index) => [topic.key, index]));
  const query = filters.search.trim().toLowerCase();
  return conventions
    .filter((c) => !filters.topicKey || c.topic_key === filters.topicKey)
    .filter((c) => !filters.severity || c.severity === filters.severity)
    .filter((c) => !filters.status || c.status === filters.status)
    .filter((c) => !query || [c.key, c.title, c.statement].join(' ').toLowerCase().includes(query))
    .sort(
      (a, b) =>
        (topicOrder.get(a.topic_key) ?? 999) - (topicOrder.get(b.topic_key) ?? 999) ||
        a.sort_order - b.sort_order ||
        a.key.localeCompare(b.key)
    );
};
