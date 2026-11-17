'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  approveDataModelProposalThunk,
  deleteDataModelProposalThunk,
} from '@/store/thunks/data-model-proposals';
import { formatDate } from '@/utils/date-time';
import { STATUS_BADGE, STATUS_LABEL } from '../../status-badge';

export const Header = () => {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const proposal = useAppSelector((state) => (selectedId ? state.dataModelProposals[selectedId] : undefined));
  const submitStatus = useAppSelector((state) => state.dataModelBuilder.submitStatus);
  const submitError = useAppSelector((state) => state.dataModelBuilder.submitError);

  if (!proposal) return null;

  const errors = proposal.warnings.filter((warning) => warning.severity === 'error').length;
  const canApprove = Boolean(proposal.proposal) && (proposal.status === 'ready' || proposal.status === 'superseded');
  const isBusy = submitStatus === 'submitting';

  const handleApprove = () => {
    if (errors > 0 && !window.confirm(`This version still breaks ${errors} MUST/NEVER rules. Approve anyway?`)) return;
    void dispatch(approveDataModelProposalThunk());
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete version ${proposal.version}? Its AI call history is deleted too.`)) return;
    void dispatch(deleteDataModelProposalThunk());
  };

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h2 className={detailPageStyles.panelTitle}>Data model · v{proposal.version}</h2>
            <span className={STATUS_BADGE[proposal.status]}>{STATUS_LABEL[proposal.status]}</span>
          </div>
          <p className={detailPageStyles.panelSubtitle}>
            {formatDate(proposal.created_at)}
            {proposal.model ? ` · ${proposal.model}` : ''}
            {proposal.input_tokens + proposal.output_tokens > 0
              ? ` · ${proposal.input_tokens.toLocaleString()} in / ${proposal.output_tokens.toLocaleString()} out tokens`
              : ''}
            {proposal.conventions_hash ? ` · conventions ${proposal.conventions_hash.slice(0, 8)}` : ''}
            {proposal.approved_at ? ` · approved ${formatDate(proposal.approved_at)}` : ''}
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isBusy || proposal.status === 'running'}
            className={`${detailPageStyles.secondaryButton} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Delete
          </button>
          {canApprove ? (
            <button type="button" onClick={handleApprove} disabled={isBusy} className={detailPageStyles.primaryButton}>
              Approve
            </button>
          ) : null}
        </div>
      </div>
      {proposal.proposal?.summary || proposal.feedback ? (
        <div className={`${detailPageStyles.panelBody} ${styles.body}`}>
          {proposal.proposal?.summary ? <p className={styles.summary}>{proposal.proposal.summary}</p> : null}
          {proposal.feedback ? (
            <p className={styles.feedback}>
              <span className={styles.feedbackLabel}>Revision feedback: </span>
              {proposal.feedback}
            </p>
          ) : null}
        </div>
      ) : null}
      {submitError ? <p className={styles.error}>{submitError}</p> : null}
    </section>
  );
};

const styles = {
  titleBlock: `min-w-0`,
  titleRow: `flex items-center gap-2`,
  actions: `flex items-center gap-2`,
  body: `flex flex-col gap-2`,
  summary: `text-xs text-gray-800 leading-relaxed`,
  feedback: `text-xs text-gray-600 leading-relaxed`,
  feedbackLabel: `font-semibold text-gray-700`,
  error: `mx-4 mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
};
