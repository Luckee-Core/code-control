'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { AiContextBuilderActions } from '@/store/builders';
import { createAiContextSnapshotThunk, previewAiContextThunk } from '@/store/thunks/ai-context';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formFieldStyles } from '@/components/form-field-styles';

export const Controls = () => {
  const dispatch = useAppDispatch();
  const builder = useAppSelector((state) => state.aiContextBuilder);
  const options = useAppSelector((state) => state.conventionOptions);
  const busy = builder.status === 'loading';

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Build context</h2>
          <p className={detailPageStyles.panelSubtitle}>
            Active conventions for one domain and repo role, as markdown for an AI request. Build only previews;
            Save snapshot freezes it so a workflow can point to the exact text it used.
          </p>
        </div>
      </div>
      <div className={styles.body}>
        <label className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Domain</span>
          <select
            value={builder.domainKey}
            onChange={(e) => dispatch(AiContextBuilderActions.setDomainKey(e.target.value))}
            className={formFieldStyles.select}
          >
            {options.domains.map((domain) => (
              <option key={domain.key} value={domain.key}>
                {domain.name}
              </option>
            ))}
          </select>
        </label>
        <label className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Repo role</span>
          <select
            value={builder.roleKey}
            onChange={(e) => dispatch(AiContextBuilderActions.setRoleKey(e.target.value))}
            className={formFieldStyles.select}
          >
            {options.repo_roles.map((role) => (
              <option key={role.key} value={role.key}>
                {role.name}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={() => void dispatch(previewAiContextThunk())}
            className={detailPageStyles.secondaryButton}
            disabled={busy}
          >
            Build context
          </button>
          <button
            type="button"
            onClick={() => void dispatch(createAiContextSnapshotThunk())}
            className={detailPageStyles.primaryButton}
            disabled={busy}
          >
            Save snapshot
          </button>
        </div>
      </div>
      {builder.error ? <p className={styles.error}>{builder.error}</p> : null}
    </section>
  );
};

const styles = {
  body: `px-4 py-4 flex flex-wrap items-end gap-4`,
  buttons: `flex gap-2`,
  error: `px-4 pb-4 text-xs text-red-600`,
};
