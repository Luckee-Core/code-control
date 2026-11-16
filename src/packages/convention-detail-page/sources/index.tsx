'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionBuilderActions } from '@/store/builders';
import { createConventionSourceThunk, deleteConventionSourceThunk } from '@/store/thunks/conventions';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formFieldStyles } from '@/components/form-field-styles';

export const Sources = () => {
  const dispatch = useAppDispatch();
  const sources = useAppSelector((state) => state.currentConvention.sources);
  const draft = useAppSelector((state) => state.conventionBuilder.sourceDraft);
  const update = (fields: Parameters<typeof ConventionBuilderActions.updateSourceDraft>[0]) =>
    dispatch(ConventionBuilderActions.updateSourceDraft(fields));

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Sources ({sources.length})</h2>
          <p className={detailPageStyles.panelSubtitle}>Where this rule came from. Not sent to the AI.</p>
        </div>
      </div>
      <div className={styles.body}>
        {sources.map((source) => (
          <div key={source.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.repo}>{source.repo}</span>
              <span className={styles.path}>{source.adr_path}</span>
              <button
                type="button"
                onClick={() => void dispatch(deleteConventionSourceThunk(source.id))}
                className={styles.remove}
              >
                Remove
              </button>
            </div>
            {source.excerpt ? <p className={styles.excerpt}>{source.excerpt}</p> : null}
          </div>
        ))}
        <div className={styles.form}>
          <p className={detailPageStyles.sectionTitle}>Add source</p>
          <div className={styles.grid}>
            <input value={draft.repo} onChange={(e) => update({ repo: e.target.value })} placeholder="Repo" className={formFieldStyles.input} />
            <input value={draft.adr_path} onChange={(e) => update({ adr_path: e.target.value })} placeholder="ADR path" className={formFieldStyles.input} />
          </div>
          <textarea value={draft.excerpt} onChange={(e) => update({ excerpt: e.target.value })} placeholder="Excerpt (optional)" className={formFieldStyles.textarea} />
          <div>
            <button
              type="button"
              onClick={() => void dispatch(createConventionSourceThunk())}
              className={detailPageStyles.primaryButton}
              disabled={!draft.repo.trim() || !draft.adr_path.trim()}
            >
              Add source
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  body: `px-4 py-4 flex flex-col gap-3`,
  item: `border border-gray-200 rounded p-3 flex flex-col gap-1`,
  itemHeader: `flex items-center gap-2 flex-wrap`,
  repo: `text-xs font-medium text-gray-900`,
  path: `font-mono text-[11px] text-gray-500`,
  remove: `ml-auto text-xs text-gray-500 hover:text-red-600 bg-transparent border-none cursor-pointer`,
  excerpt: `text-xs text-gray-600 whitespace-pre-wrap`,
  form: `flex flex-col gap-2 border-t border-gray-200 pt-4`,
  grid: `grid grid-cols-1 md:grid-cols-2 gap-2`,
};
