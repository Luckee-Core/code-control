'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { ActionMessages, AiCalls, DraftActions, HandOff, LineageStrip, ReviewActions, RunHeader, RunningNotice, VersionsTabs } from '@/components/agent-runs';
import { PR_AGENT_RUNS_PATH } from '@/config/routes';
import { useBreadcrumbs } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAgentRunDetailThunk } from '@/store/thunks/agent-runs';
import { Edits } from './edits';
import { FeedbackInput } from './inputs/feedback';
import { FocusFilesInput } from './inputs/focus-files';

const POLL_MS = 3000;

export const PrAgentRunDetailPage = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentAgentRun);
  const details = useAppSelector((state) => state.agentRunDetails);
  const builder = useAppSelector((state) => state.agentRunsBuilder);
  const detail = details[current.id];
  const run = detail?.run;

  useBreadcrumbs([{ label: 'PR feedback', href: PR_AGENT_RUNS_PATH }, { label: run?.title || 'PR agent run' }]);

  useEffect(() => {
    if (current.id && !detail) void dispatch(getAgentRunDetailThunk());
  }, [dispatch, current.id, detail]);
  useEffect(() => {
    if (run?.status !== 'running') return;
    const timer = setInterval(() => void dispatch(getAgentRunDetailThunk(undefined, true)), POLL_MS);
    return () => clearInterval(timer);
  }, [dispatch, run?.status]);

  const delivery = detail?.pr?.delivery ?? null;
  const notes = useMemo(() => (Array.isArray(run?.output.notes) ? (run?.output.notes as string[]) : []), [run?.output]);
  const omitted = useMemo(() => (Array.isArray(run?.output.omitted_files) ? (run?.output.omitted_files as string[]) : []), [run?.output]);

  if (!current.id || (!detail && builder.detailStatus !== 'loading')) {
    return (
      <div className={detailPageStyles.page}>
        <div className={detailPageStyles.emptyState}>
          <p className={detailPageStyles.fieldValue}>{builder.detailError ?? 'No PR agent run selected'}</p>
          <a href={PR_AGENT_RUNS_PATH} className={detailPageStyles.emptyLink}>Back to PR feedback</a>
        </div>
      </div>
    );
  }
  if (!detail || !run) return <p className={styles.loading}>Loading…</p>;

  const subtitle = (
    <>
      {detail.software_system_name ?? 'Project'} · {delivery ? `${delivery.repo_full_name} (${delivery.role}, ${delivery.kind === 'crud' ? 'data access' : delivery.kind === 'layout' ? 'app layout' : delivery.kind === 'list' ? 'list pages' : delivery.kind === 'detail' ? 'detail pages' : delivery.kind === 'dashboard' ? 'dashboard' : delivery.kind === 'dispatcher' ? 'project dispatcher' : 'data model'})` : run.role_key}
      {delivery?.pr_number ? (
        <>
          {' · '}
          <a href={delivery.pr_url} target="_blank" rel="noopener noreferrer" className={styles.link}>PR #{delivery.pr_number}</a>
        </>
      ) : null}
    </>
  );
  const commitSha = typeof run.output.commit_sha === 'string' ? run.output.commit_sha : null;

  return (
    <div className={detailPageStyles.page}>
      <LineageStrip lineage={detail.lineage} handOffs={detail.children} currentId={run.id} />
      <VersionsTabs versions={detail.versions} currentId={run.id} />
      <RunHeader run={run} subtitle={subtitle} />
      <ActionMessages />

      {run.status === 'draft' ? (
        <DraftActions
          title="Ready to run"
          description="The PR agent reads the PR at its branch head and proposes edits to this PR only. Nothing runs until you confirm."
          confirmDisabledReason={builder.draftFeedback.trim() ? null : 'Add feedback first'}
        >
          <FeedbackInput />
          <FocusFilesInput files={delivery?.files ?? []} />
        </DraftActions>
      ) : (
        <section className={detailPageStyles.panel}>
          <div className={detailPageStyles.panelHeader}>
            <h2 className={detailPageStyles.panelTitle}>Feedback</h2>
          </div>
          <div className={styles.feedback}>
            <p className={styles.feedbackText}>{String(run.input.feedback ?? '')}</p>
            {Array.isArray(run.input.focus_paths) && run.input.focus_paths.length > 0 ? (
              <p className={styles.focus}>Focus: {(run.input.focus_paths as string[]).join(', ')}</p>
            ) : null}
            {run.instructions ? <p className={styles.focus}>Instructions: {run.instructions}</p> : null}
          </div>
        </section>
      )}

      {run.status === 'running' ? <RunningNotice text="The PR agent is reading the PR and preparing edits…" /> : null}
      {detail.pr && detail.pr.edits.length > 0 ? <Edits edits={detail.pr.edits} findings={run.findings} notes={notes} omitted={omitted} /> : null}
      {run.status === 'no_change' ? <p className={styles.muted}>The agent proposed no changes. Revise with more specific feedback.</p> : null}

      <ReviewActions
        run={run}
        approveLabel="Approve and commit to the PR"
        approveHint="Approving commits these edits to the PR branch and creates a convention agent draft (it won't run until you confirm it)."
        rejectLabel="Reject"
        reviseLabel="Revise"
        revisePlaceholder="What should the agent do differently?"
      />

      {run.status === 'approved' ? (
        <HandOff title="Committed" runs={detail.children}>
          {commitSha && delivery ? (
            <p className={styles.commit}>
              Commit <span className={styles.mono}>{commitSha.slice(0, 7)}</span> on {delivery.branch}
              {delivery.pr_url ? (
                <>
                  {' · '}
                  <a href={delivery.pr_url} target="_blank" rel="noopener noreferrer" className={styles.link}>View PR</a>
                </>
              ) : null}
            </p>
          ) : null}
        </HandOff>
      ) : null}

      <AiCalls exchanges={detail.exchanges} />
    </div>
  );
};

const styles = {
  loading: `text-xs text-gray-500`,
  link: `text-blue-600 hover:underline`,
  feedback: `px-4 py-3 flex flex-col gap-1`,
  feedbackText: `text-xs text-gray-900 whitespace-pre-wrap`,
  focus: `text-[11px] text-gray-500`,
  muted: `text-xs text-gray-500`,
  commit: `text-xs text-gray-800`,
  mono: `font-mono`,
};
