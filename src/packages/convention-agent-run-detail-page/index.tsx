'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { ActionMessages, AiCalls, DraftActions, Findings, HandOff, LineageStrip, ReviewActions, RunHeader, RunningNotice, VersionsTabs } from '@/components/agent-runs';
import { CONVENTION_AGENT_RUNS_PATH } from '@/config/routes';
import { useBreadcrumbs } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAgentRunDetailThunk } from '@/store/thunks/agent-runs';
import { ChangeCard } from './change-card';
import { Context } from './context';

const POLL_MS = 3000;

export const ConventionAgentRunDetailPage = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentAgentRun);
  const details = useAppSelector((state) => state.agentRunDetails);
  const builder = useAppSelector((state) => state.agentRunsBuilder);
  const detail = details[current.id];
  const run = detail?.run;

  useBreadcrumbs([{ label: 'Conventions', href: CONVENTION_AGENT_RUNS_PATH }, { label: 'Agent runs', href: CONVENTION_AGENT_RUNS_PATH }, { label: run?.title || 'Convention agent run' }]);

  useEffect(() => {
    if (current.id && !detail) void dispatch(getAgentRunDetailThunk());
  }, [dispatch, current.id, detail]);
  useEffect(() => {
    if (run?.status !== 'running') return;
    const timer = setInterval(() => void dispatch(getAgentRunDetailThunk(undefined, true)), POLL_MS);
    return () => clearInterval(timer);
  }, [dispatch, run?.status]);

  const changes = useMemo(() => detail?.convention?.changes ?? [], [detail]);
  const proposed = useMemo(() => changes.filter((change) => change.status === 'proposed'), [changes]);
  const undecided = useMemo(() => proposed.filter((change) => !builder.decisions[change.id]?.action), [proposed, builder.decisions]);
  const accepted = useMemo(() => proposed.filter((change) => builder.decisions[change.id]?.action === 'accept'), [proposed, builder.decisions]);

  if (!current.id || (!detail && builder.detailStatus !== 'loading')) {
    return (
      <div className={detailPageStyles.page}>
        <div className={detailPageStyles.emptyState}>
          <p className={detailPageStyles.fieldValue}>{builder.detailError ?? 'No convention agent run selected'}</p>
          <a href={CONVENTION_AGENT_RUNS_PATH} className={detailPageStyles.emptyLink}>Back to convention agent runs</a>
        </div>
      </div>
    );
  }
  if (!detail || !run) return <p className={styles.loading}>Loading…</p>;

  const reviewing = run.status === 'needs_review';
  const approveLabel = accepted.length === 0 ? 'Reject all proposals' : `Apply ${accepted.length} change${accepted.length === 1 ? '' : 's'}`;

  return (
    <div className={detailPageStyles.page}>
      <LineageStrip lineage={detail.lineage} handOffs={detail.children} currentId={run.id} />
      <VersionsTabs versions={detail.versions} currentId={run.id} />
      <RunHeader run={run} subtitle={<>{detail.software_system_name ?? 'Manual'} · role {run.role_key ?? '—'}</>} />
      <ActionMessages />
      <Context prRun={detail.convention?.pr_run ?? null} edits={detail.convention?.pr_edits ?? []} />

      {run.status === 'draft' ? (
        <DraftActions
          title="Ready to run"
          description="The convention agent compares the feedback and the approved PR change with the whole convention catalog and proposes changes (or none). Nothing is applied until you approve."
        />
      ) : null}
      {run.status === 'running' ? <RunningNotice text="The convention agent is comparing the change with the catalog…" /> : null}
      {run.status === 'no_change' ? (
        <section className={detailPageStyles.panel}>
          <div className={styles.body}>
            <p className={detailPageStyles.sectionTitle}>No convention change needed</p>
            <p className={styles.text}>{String(run.output.no_change_reason ?? run.summary)}</p>
          </div>
        </section>
      ) : null}

      {changes.length > 0 ? (
        <section className={detailPageStyles.panel}>
          <div className={detailPageStyles.panelHeader}>
            <div>
              <h2 className={detailPageStyles.panelTitle}>Proposed convention changes</h2>
              <p className={detailPageStyles.panelSubtitle}>
                {reviewing ? `${proposed.length - undecided.length} of ${proposed.length} decided. Accept, reject or edit each one.` : `${changes.length} proposals`}
              </p>
            </div>
          </div>
          <div className={styles.cards}>
            {changes.map((change) => (
              <ChangeCard key={change.id} change={change} related={detail.convention?.related ?? []} editable={reviewing} />
            ))}
          </div>
          {run.findings.length > 0 ? (
            <div className={styles.body}>
              <p className={detailPageStyles.sectionTitle}>Checks</p>
              <Findings findings={run.findings} />
            </div>
          ) : null}
        </section>
      ) : null}

      <ReviewActions
        run={run}
        approveLabel={approveLabel}
        approveHint="Accepted changes are written to the conventions (and the change ledger). Each affected template repo then gets a template agent draft."
        rejectLabel="Reject all"
        reviseLabel="Revise"
        revisePlaceholder="What should the proposals do differently?"
        approveDisabledReason={undecided.length > 0 ? `Decide ${undecided.length} more proposal${undecided.length === 1 ? '' : 's'}` : null}
      />

      {run.status === 'approved' ? (
        <HandOff title="Template agent drafts" runs={detail.children}>
          <p className={styles.text}>
            Applied {String(run.output.applied_count ?? 0)}, rejected {String(run.output.rejected_count ?? 0)}. Drafts collect these changes per template repo until you run them.
          </p>
        </HandOff>
      ) : null}

      <AiCalls exchanges={detail.exchanges} />
    </div>
  );
};

const styles = {
  loading: `text-xs text-gray-500`,
  body: `px-4 py-3 flex flex-col gap-2`,
  cards: `px-4 py-3 flex flex-col gap-3`,
  text: `text-xs text-gray-800 whitespace-pre-wrap`,
};
