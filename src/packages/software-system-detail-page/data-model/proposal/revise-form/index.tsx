'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { DataModelBuilderActions } from '@/store/builders';
import { reviseDataModelProposalThunk } from '@/store/thunks/data-model-proposals';

export const ReviseForm = () => {
  const dispatch = useAppDispatch();
  const feedbackDraft = useAppSelector((state) => state.dataModelBuilder.feedbackDraft);
  const submitStatus = useAppSelector((state) => state.dataModelBuilder.submitStatus);
  const isSubmitting = submitStatus === 'submitting';

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Revise</h2>
          <p className={detailPageStyles.panelSubtitle}>
            Say what to change. The AI revises this version into a new one and keeps everything else stable.
          </p>
        </div>
      </div>
      <div className={`${detailPageStyles.panelBody} ${styles.body}`}>
        <textarea
          value={feedbackDraft}
          onChange={(event) => dispatch(DataModelBuilderActions.setFeedbackDraft(event.target.value))}
          placeholder="e.g. Merge faq_categories into faqs as an enum. Add a sources table for where each fact came from."
          rows={4}
          className={styles.textarea}
        />
        <div className={styles.footer}>
          <button
            type="button"
            onClick={() => void dispatch(reviseDataModelProposalThunk())}
            disabled={isSubmitting || !feedbackDraft.trim()}
            className={detailPageStyles.primaryButton}
          >
            {isSubmitting ? 'Starting…' : 'Revise'}
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
  footer: `flex justify-end`,
};
