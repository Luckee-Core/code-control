'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { fieldStyles } from '../../field-styles';

export const TopicInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);
  const catalog = useAppSelector((state) => state.conventionsCatalog);

  const handleChange = (topicKey: string) => {
    const topic = catalog.topics.find((item) => item.key === topicKey);
    dispatch(
      CurrentConventionActions.updateFields({
        topic_key: topicKey,
        ...(current.id || !topic ? {} : { domain_key: topic.domain_key }),
      }),
    );
  };

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>Topic *</label>
      <select
        value={current.topic_key}
        onChange={(event) => handleChange(event.target.value)}
        className={fieldStyles.select}
      >
        <option value="">Choose a topic</option>
        {catalog.domains.map((domain) => (
          <optgroup key={domain.key} label={domain.name}>
            {catalog.topics
              .filter((topic) => topic.domain_key === domain.key)
              .map((topic) => (
                <option key={topic.key} value={topic.key}>
                  {topic.name}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};
