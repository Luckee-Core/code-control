'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { formFieldStyles } from '@/components/form-field-styles';
import { useAppDispatch, useAppSelector, TicketBuildBuilderActions } from '@/store';
import { reviseTicketBuildThunk, startTicketBuildThunk } from '@/store/thunks/ticket-builds';
import { BUILD_STATUS } from '../status-badges';

/**
 * Build header: ops ticket, system, status, model/tokens, and the Revise / Approve & build actions.
 */
export const TicketBuildSummaryCard = () => {
  const dispatch = useAppDispatch();
  const build = useAppSelector((state) => state.currentTicketBuild);
  const softwareSystems = useAppSelector((state) => state.softwareSystems);
  const ticketBuildBuilder = useAppSelector((state) => state.ticketBuildBuilder);
  const badge = BUILD_STATUS[build.status];
  const systemName = softwareSystems[build.software_system_id]?.name ?? 'Software system';
  const canRevise = build.status === 'plan_ready' || build.status === 'plan_failed';
  const busy = ticketBuildBuilder.submitStatus === 'submitting';

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h1 className={detailPageStyles.panelTitle}>{build.ops_ticket_title}</h1>
          <p className={detailPageStyles.panelSubtitle}>
            Ticket build · {systemName} · My Ops Tracker ticket {build.ops_ticket_id.slice(0, 8)}
          </p>
        </div>
        <div className={styles.actions}>
          <span className={badge.className}>{badge.label}</span>
          {canRevise ? (
            <button
              type="button"
              className={detailPageStyles.secondaryButton}
              onClick={() => dispatch(TicketBuildBuilderActions.setReviseOpen(!ticketBuildBuilder.isReviseOpen))}
            >
              Revise…
            </button>
          ) : null}
          {build.status === 'plan_ready' ? (
            <button
              type="button"
              className={detailPageStyles.primaryButton}
              disabled={busy}
              onClick={() => void dispatch(startTicketBuildThunk())}
            >
              {busy ? 'Starting…' : 'Approve & build'}
            </button>
          ) : null}
        </div>
      </div>
      <div className={detailPageStyles.panelBody}>
        {build.ops_ticket_description ? <p className={styles.description}>{build.ops_ticket_description}</p> : null}
        <p className={styles.meta}>
          {build.model || 'model pending'} · {build.input_tokens.toLocaleString()} in / {build.output_tokens.toLocaleString()} out
          {build.research_used ? ' · used ops Research' : ''}
        </p>
        {build.error ? <p className={styles.error}>{build.error}</p> : null}
        {ticketBuildBuilder.submitError ? <p className={styles.error}>{ticketBuildBuilder.submitError}</p> : null}
        {ticketBuildBuilder.isReviseOpen && canRevise ? (
          <div className={styles.revise}>
            <label className={formFieldStyles.label} htmlFor="ticket-build-feedback">
              What should change?
            </label>
            <textarea
              id="ticket-build-feedback"
              className={formFieldStyles.textarea}
              value={ticketBuildBuilder.feedbackDraft}
              onChange={(event) => dispatch(TicketBuildBuilderActions.setFeedbackDraft(event.target.value))}
              placeholder="e.g. keep photos on the studio disk instead of the database"
            />
            <div>
              <button
                type="button"
                className={detailPageStyles.primaryButton}
                disabled={busy}
                onClick={() => void dispatch(reviseTicketBuildThunk())}
              >
                {busy ? 'Revising…' : 'Plan again'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

const styles = {
  actions: `flex flex-wrap items-center gap-2`,
  description: `text-sm text-gray-800 whitespace-pre-wrap mb-2`,
  meta: `text-xs text-gray-500`,
  error: `mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 whitespace-pre-wrap`,
  revise: `mt-3 flex flex-col gap-2`,
};
