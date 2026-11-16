'use client';

import { useMemo } from 'react';
import { formFieldStyles } from '@/components/form-field-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionBuilderActions } from '@/store/builders';

export const IdentityInputs = () => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.conventionBuilder.createForm);
  const options = useAppSelector((state) => state.conventionOptions);
  const topics = useMemo(
    () => options.topics.filter((topic) => topic.domain_key === form.domain_key),
    [options.topics, form.domain_key]
  );

  return (
    <>
      <label className={formFieldStyles.field}>
        <span className={formFieldStyles.label}>Key</span>
        <input
          value={form.key}
          onChange={(event) => dispatch(ConventionBuilderActions.updateCreateForm({ key: event.target.value }))}
          placeholder="dm.table.snake_plural"
          className={formFieldStyles.input}
        />
      </label>
      <div className={formFieldStyles.row}>
        <label className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Domain</span>
          <select
            value={form.domain_key}
            onChange={(event) =>
              dispatch(ConventionBuilderActions.updateCreateForm({ domain_key: event.target.value, topic_key: '' }))
            }
            className={formFieldStyles.select}
          >
            <option value="">Select a domain</option>
            {options.domains.map((domain) => (
              <option key={domain.key} value={domain.key}>
                {domain.name}
              </option>
            ))}
          </select>
        </label>
        <label className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Topic</span>
          <select
            value={form.topic_key}
            onChange={(event) => dispatch(ConventionBuilderActions.updateCreateForm({ topic_key: event.target.value }))}
            className={formFieldStyles.select}
            disabled={!form.domain_key}
          >
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic.key} value={topic.key}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
};
