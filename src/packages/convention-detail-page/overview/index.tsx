'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { deleteConventionThunk, updateConventionThunk } from '@/store/thunks/conventions';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formFieldStyles } from '@/components/form-field-styles';
import { CONVENTIONS_PATH } from '@/config/routes';
import type { ConventionSeverity, ConventionStatus } from '@/model/convention';
import { CONVENTION_SEVERITIES, CONVENTION_STATUSES } from '@/packages/conventions/convention-enums';

export const Overview = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const convention = useAppSelector((state) => state.currentConvention.convention);
  const options = useAppSelector((state) => state.conventionOptions);
  const builder = useAppSelector((state) => state.conventionBuilder);

  const topics = useMemo(
    () => options.topics.filter((topic) => topic.domain_key === convention.domain_key),
    [options.topics, convention.domain_key]
  );
  const update = (fields: Parameters<typeof CurrentConventionActions.updateConventionFields>[0]) =>
    dispatch(CurrentConventionActions.updateConventionFields(fields));

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${convention.key}? Its roles, examples and sources are deleted too.`)) return;
    const result = await dispatch(deleteConventionThunk());
    if (result === 200) router.push(CONVENTIONS_PATH);
  };

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>{convention.key}</h2>
          <p className={detailPageStyles.panelSubtitle}>Domain {convention.domain_key}. Save also saves the roles below.</p>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={() => void handleDelete()} className={detailPageStyles.secondaryButton}>
            Delete
          </button>
          <button
            type="button"
            onClick={() => void dispatch(updateConventionThunk())}
            className={detailPageStyles.primaryButton}
            disabled={builder.isSaving}
          >
            {builder.isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
      <div className={styles.body}>
        <label className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Title</span>
          <input value={convention.title} onChange={(e) => update({ title: e.target.value })} className={formFieldStyles.input} />
        </label>
        <div className={styles.grid}>
          <label className={formFieldStyles.field}>
            <span className={formFieldStyles.label}>Topic</span>
            <select value={convention.topic_key} onChange={(e) => update({ topic_key: e.target.value })} className={formFieldStyles.select}>
              {topics.map((topic) => (
                <option key={topic.key} value={topic.key}>
                  {topic.name}
                </option>
              ))}
            </select>
          </label>
          <label className={formFieldStyles.field}>
            <span className={formFieldStyles.label}>Severity</span>
            <select
              value={convention.severity}
              onChange={(e) => update({ severity: e.target.value as ConventionSeverity })}
              className={formFieldStyles.select}
            >
              {CONVENTION_SEVERITIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className={formFieldStyles.field}>
            <span className={formFieldStyles.label}>Status</span>
            <select
              value={convention.status}
              onChange={(e) => update({ status: e.target.value as ConventionStatus })}
              className={formFieldStyles.select}
            >
              {CONVENTION_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className={formFieldStyles.field}>
            <span className={formFieldStyles.label}>Sort order</span>
            <input
              type="number"
              value={convention.sort_order}
              onChange={(e) => update({ sort_order: Number(e.target.value) || 0 })}
              className={formFieldStyles.input}
            />
          </label>
        </div>
        <label className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Statement</span>
          <textarea value={convention.statement} onChange={(e) => update({ statement: e.target.value })} className={formFieldStyles.textarea} />
        </label>
        <label className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Rationale</span>
          <textarea value={convention.rationale} onChange={(e) => update({ rationale: e.target.value })} className={formFieldStyles.textarea} />
        </label>
        {builder.error ? <p className={formFieldStyles.error}>{builder.error}</p> : null}
      </div>
    </section>
  );
};

const styles = {
  actions: `flex gap-2`,
  body: `px-4 py-4 flex flex-col gap-3`,
  grid: `grid grid-cols-2 md:grid-cols-4 gap-3`,
};
