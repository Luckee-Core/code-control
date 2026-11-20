'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { AgentRun } from '@/model/agent-run';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';
import { approveAgentRunThunk, rejectAgentRunThunk, retryAgentRunThunk, reviseAgentRunThunk } from '@/store/thunks/agent-runs';
import { DecisionNoteInput } from '../forms/decision-note';
import { ReviseFeedbackInput } from '../forms/revise-feedback';

type ReviewActionsProps = {
  run: AgentRun;
  approveLabel: string;
  approveHint: string;
  rejectLabel: string;
  reviseLabel: string;
  revisePlaceholder: string;
  /** Template runs: offer to revert the carried convention changes on deny. */
  showRevert?: boolean;
  approveDisabledReason?: string | null;
};

/**
 * Review panel for a run that needs review (approve / revise / reject), or failed / no-change
 * runs (retry / revise).
 */
export const ReviewActions = (props: ReviewActionsProps) => {
  const dispatch = useAppDispatch();
  const builder = useAppSelector((state) => state.agentRunsBuilder);
  const { run } = props;
  const busy = builder.action !== '';
  const reviewable = run.status === 'needs_review';
  const revisable = reviewable || run.status === 'failed' || run.status === 'no_change';
  if (!revisable) return null;

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>{reviewable ? 'Your review' : run.status === 'failed' ? 'This run failed' : 'Nothing to apply'}</h2>
          {reviewable ? <p className={detailPageStyles.panelSubtitle}>{props.approveHint}</p> : null}
        </div>
      </div>
      <div className={styles.body}>
        {reviewable ? (
          <div className={styles.block}>
            <DecisionNoteInput />
            {props.showRevert ? (
              <label className={styles.checkbox}>
                <input type="checkbox" checked={builder.revertChanges} onChange={(event) => dispatch(AgentRunsBuilderActions.setRevertChanges(event.target.checked))} />
                When denying, also revert the convention changes this PR carries (applies to every repo).
              </label>
            ) : null}
            <div className={styles.buttons}>
              <button
                type="button"
                onClick={() => void dispatch(approveAgentRunThunk())}
                disabled={busy || Boolean(props.approveDisabledReason)}
                title={props.approveDisabledReason ?? undefined}
                className={detailPageStyles.primaryButton}
              >
                {builder.action === 'approve' ? 'Working…' : props.approveLabel}
              </button>
              <button type="button" onClick={() => void dispatch(rejectAgentRunThunk())} disabled={busy} className={styles.danger}>
                {builder.action === 'reject' ? 'Working…' : props.rejectLabel}
              </button>
              {props.approveDisabledReason ? <span className={styles.hint}>{props.approveDisabledReason}</span> : null}
            </div>
          </div>
        ) : null}
        {run.status === 'failed' ? (
          <div className={styles.buttons}>
            <button type="button" onClick={() => void dispatch(retryAgentRunThunk())} disabled={busy} className={detailPageStyles.primaryButton}>
              {builder.action === 'retry' ? 'Starting…' : 'Retry with the same input'}
            </button>
          </div>
        ) : null}
        <div className={styles.block}>
          <ReviseFeedbackInput label={props.reviseLabel} placeholder={props.revisePlaceholder} />
          <div className={styles.buttons}>
            <button type="button" onClick={() => void dispatch(reviseAgentRunThunk())} disabled={busy || !builder.reviseFeedback.trim()} className={detailPageStyles.secondaryButton}>
              {builder.action === 'revise' ? 'Starting…' : `${props.reviseLabel} → run v${run.version + 1}`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  body: `px-4 py-3 flex flex-col gap-4`,
  block: `flex flex-col gap-2`,
  buttons: `flex flex-wrap items-center gap-2`,
  checkbox: `flex items-center gap-2 text-xs text-gray-700 cursor-pointer`,
  hint: `text-[11px] text-amber-800`,
  danger: `text-xs font-medium text-red-700 px-3 py-1.5 rounded border border-red-200 bg-white hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`,
};
