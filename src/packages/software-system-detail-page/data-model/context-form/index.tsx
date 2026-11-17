'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { DataModelBuilderActions } from '@/store/builders';
import { generateDataModelProposalThunk } from '@/store/thunks/data-model-proposals';

export const ContextForm = () => {
  const dispatch = useAppDispatch();
  const contextDraft = useAppSelector((state) => state.dataModelBuilder.contextDraft);
  const submitStatus = useAppSelector((state) => state.dataModelBuilder.submitStatus);
  const isSubmitting = submitStatus === 'submitting';

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Product context</h2>
          <p className={detailPageStyles.panelSubtitle}>
            What the product is and what it must track. AI proposes the core tables using the active data-model
            conventions.
          </p>
        </div>
      </div>
      <div className={`${detailPageStyles.panelBody} ${styles.body}`}>
        <textarea
          value={contextDraft}
          onChange={(event) => dispatch(DataModelBuilderActions.setContextDraft(event.target.value))}
          placeholder="Paste the business context: who it is for, what it tracks, the main workflows…"
          rows={14}
          className={styles.textarea}
        />
        <div className={styles.footer}>
          <span className={styles.count}>{contextDraft.length.toLocaleString()} chars</span>
          <button
            type="button"
            onClick={() => void dispatch(generateDataModelProposalThunk())}
            disabled={isSubmitting || !contextDraft.trim()}
            className={detailPageStyles.primaryButton}
          >
            {isSubmitting ? 'Starting…' : 'Generate data model'}
          </button>
        </div>
      </div>
    </section>
  );
};

const styles = {
  body: `flex flex-col gap-2`,
  textarea: `
    w-full px-2 py-1.5 text-xs text-gray-900 bg-white border border-gray-300 rounded resize-y
    focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed
  `,
  footer: `flex items-center justify-between gap-2`,
  count: `text-[11px] text-gray-500 tabular-nums`,
};
