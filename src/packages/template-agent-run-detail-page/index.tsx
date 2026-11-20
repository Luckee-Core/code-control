'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { ActionMessages, AiCalls, DraftActions, Findings, LineageStrip, ReviewActions, RunHeader, RunningNotice, VersionsTabs } from '@/components/agent-runs';
import { TEMPLATE_AGENT_RUNS_PATH } from '@/config/routes';
import { useBreadcrumbs } from '@/hooks';
import { AgentRunsBuilderActions, useAppDispatch, useAppSelector } from '@/store';
import { getAgentRunDetailThunk } from '@/store/thunks/agent-runs';
import { CarriedChanges } from './carried-changes';
import { Convergence, type MergedRepo } from './convergence';
import { PrFiles } from './pr-files';
import { RenderPreview } from './render-preview';

const POLL_MS = 3000;
type RepoOutcome = { status: 'pr' | 'not_needed' | 'failed'; summary: string; reason?: string; error?: string; files?: Array<{ path: string; explanation: string }> };

const OUTCOME_LABEL: Record<RepoOutcome['status'], string> = { pr: 'PR', not_needed: 'no change', failed: 'failed' };

const TABS = [
  { key: 'files', label: 'Files' },
  { key: 'preview', label: 'Render preview' },
] as const;

export const TemplateAgentRunDetailPage = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentAgentRun);
  const details = useAppSelector((state) => state.agentRunDetails);
  const builder = useAppSelector((state) => state.agentRunsBuilder);
  const detail = details[current.id];
  const run = detail?.run;

  useBreadcrumbs([{ label: 'Template agents', href: TEMPLATE_AGENT_RUNS_PATH }, { label: run?.title || 'Template agent run' }]);

  useEffect(() => {
    if (current.id && !detail) void dispatch(getAgentRunDetailThunk());
  }, [dispatch, current.id, detail]);
  useEffect(() => {
    if (run?.status !== 'running' && run?.status !== 'draft') return;
    // Drafts keep collecting changes, so they refresh too (slower).
    const timer = setInterval(() => void dispatch(getAgentRunDetailThunk(undefined, true)), run.status === 'running' ? POLL_MS : POLL_MS * 5);
    return () => clearInterval(timer);
  }, [dispatch, run?.status]);

  const outcomes = useMemo(() => (run?.output.repos as Record<string, RepoOutcome> | undefined) ?? {}, [run?.output]);
  const repos = useMemo(() => detail?.template?.repos ?? [], [detail?.template]);
  const activeRepo = repos.includes(builder.templateRepo) ? builder.templateRepo : '';
  useEffect(() => {
    if (repos.length === 0 || repos.includes(builder.templateRepo)) return;
    const withPr = detail?.template?.template_changes[0]?.repo_full_name;
    dispatch(AgentRunsBuilderActions.setTemplateRepo(withPr && repos.includes(withPr) ? withPr : repos[0]));
  }, [dispatch, repos, builder.templateRepo, detail?.template]);
  const explanations = useMemo(() => {
    const files = outcomes[activeRepo]?.files ?? [];
    return Object.fromEntries(files.map((file) => [file.path, file.explanation]));
  }, [outcomes, activeRepo]);
  const repoFindings = useMemo(() => (run?.findings ?? []).filter((finding) => !finding.repo || finding.repo === activeRepo), [run?.findings, activeRepo]);
  const scopeCount = useMemo(() => Object.values(builder.scope).filter(Boolean).length, [builder.scope]);

  if (!current.id || (!detail && builder.detailStatus !== 'loading')) {
    return (
      <div className={detailPageStyles.page}>
        <div className={detailPageStyles.emptyState}>
          <p className={detailPageStyles.fieldValue}>{builder.detailError ?? 'No template agent run selected'}</p>
          <a href={TEMPLATE_AGENT_RUNS_PATH} className={detailPageStyles.emptyLink}>Back to template agents</a>
        </div>
      </div>
    );
  }
  if (!detail || !run || !detail.template) return <p className={styles.loading}>Loading…</p>;

  const templateChanges = detail.template.template_changes;
  const change = templateChanges.find((item) => item.repo_full_name === activeRepo) ?? null;
  const outcome = outcomes[activeRepo];
  const hasPr = Boolean(change?.pr_number);
  const merged = Array.isArray(run.output.merged) ? (run.output.merged as MergedRepo[]) : [];
  const subtitle = (
    <>
      {repos.length} template repo{repos.length === 1 ? '' : 's'}
      {templateChanges.length > 0 ? ` · ${templateChanges.length} PR${templateChanges.length === 1 ? '' : 's'}` : ''}
    </>
  );

  return (
    <div className={detailPageStyles.page}>
      <LineageStrip lineage={detail.lineage} handOffs={detail.children} currentId={run.id} />
      <VersionsTabs versions={detail.versions} currentId={run.id} />
      <RunHeader run={run} subtitle={subtitle} />
      <ActionMessages />
      <CarriedChanges changes={detail.template.changes} propagations={detail.template.propagations} selectable={run.status === 'draft'} />

      {run.status === 'draft' ? (
        <DraftActions
          title="Collecting changes — ready to run"
          description={`Newly applied convention changes keep joining this draft. When you confirm, the template agent works through each affected template repo (${repos.map((repo) => repo.split('/')[1] ?? repo).join(', ') || 'none yet'}) and opens one PR per repo that needs a change.`}
          confirmDisabledReason={scopeCount === 0 ? 'Keep at least one change in scope' : null}
        />
      ) : null}
      {run.status === 'running' ? <RunningNotice text="The template agent is going through each template repo and preparing its PRs…" /> : null}
      {run.status === 'no_change' ? <p className={styles.muted}>None of the template repos needs a change.</p> : null}

      {repos.length > 0 && run.status !== 'draft' ? (
        <section className={detailPageStyles.panel}>
          <div className={styles.repoTabs} role="tablist" aria-label="Template repos">
            {repos.map((repo) => {
              const repoChange = templateChanges.find((item) => item.repo_full_name === repo);
              const repoOutcome = outcomes[repo];
              const label = repoChange ? `PR #${repoChange.pr_number} · ${repoChange.status}` : repoOutcome ? OUTCOME_LABEL[repoOutcome.status] : run.status === 'running' ? 'working…' : '—';
              return (
                <button
                  key={repo}
                  type="button"
                  role="tab"
                  aria-selected={activeRepo === repo}
                  onClick={() => dispatch(AgentRunsBuilderActions.setTemplateRepo(repo))}
                  className={activeRepo === repo ? styles.repoOn : styles.repoOff}
                >
                  <span className={styles.repoName}>{repo.split('/')[1] ?? repo}</span>
                  <span className={styles.repoState}>{label}</span>
                </button>
              );
            })}
          </div>
          <div className={styles.repoBody}>
            {change?.pr_number ? (
              <p className={styles.muted}>
                <a href={change.pr_url} target="_blank" rel="noopener noreferrer" className={styles.link}>{activeRepo} PR #{change.pr_number}</a> ({change.status}) · {change.branch} ·{' '}
                <span className={styles.shas}>{change.base_sha.slice(0, 7)} → {change.head_sha.slice(0, 7)}</span>
              </p>
            ) : null}
            {outcome ? <p className={styles.summary}>{outcome.status === 'not_needed' ? `No change needed: ${outcome.reason}` : outcome.status === 'failed' ? `Failed: ${outcome.error}` : outcome.summary}</p> : null}
          </div>
        </section>
      ) : null}

      {hasPr && activeRepo ? (
        <section className={detailPageStyles.panel}>
          <div className={detailPageStyles.panelHeader}>
            <div className={styles.tabs} role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={builder.templateTab === tab.key}
                  onClick={() => dispatch(AgentRunsBuilderActions.setTemplateTab(tab.key))}
                  className={builder.templateTab === tab.key ? styles.tabOn : styles.tabOff}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span className={styles.shas}>{activeRepo}</span>
          </div>
          <div className={styles.body}>
            {builder.templateTab === 'preview' ? <RenderPreview runId={run.id} repo={activeRepo} /> : <PrFiles runId={run.id} repo={activeRepo} explanations={explanations} />}
            <div>
              <p className={detailPageStyles.sectionTitle}>Checks (sample render with these templates)</p>
              <Findings findings={repoFindings} />
            </div>
          </div>
        </section>
      ) : null}

      <ReviewActions
        run={run}
        approveLabel={templateChanges.length > 1 ? `Approve and merge ${templateChanges.length} PRs` : 'Approve and merge'}
        approveHint="Merging updates the template repos: new projects and Re-render use these templates. Then Code Control checks whether they reproduce the original PR fix."
        rejectLabel={templateChanges.length > 1 ? 'Deny (close all PRs)' : 'Deny'}
        reviseLabel="Request changes"
        revisePlaceholder="What should change? Name the repo if it's only one (new commits are pushed to the same PRs)"
        showRevert
      />

      {run.status === 'approved' && merged.length > 0 ? <Convergence merged={merged} /> : null}

      <AiCalls exchanges={detail.exchanges} />
    </div>
  );
};

const styles = {
  loading: `text-xs text-gray-500`,
  link: `text-blue-600 hover:underline`,
  muted: `text-xs text-gray-600`,
  body: `px-4 py-3 flex flex-col gap-4`,
  tabs: `flex gap-1`,
  tabOn: `text-xs px-3 py-1 rounded bg-gray-900 text-white cursor-default`,
  tabOff: `text-xs px-3 py-1 rounded text-gray-700 hover:bg-gray-100 cursor-pointer`,
  shas: `text-[11px] font-mono text-gray-500`,
  summary: `text-xs text-gray-800 whitespace-pre-wrap`,
  repoTabs: `flex flex-wrap gap-1 px-3 pt-3 border-b border-gray-200`,
  repoOn: `flex flex-col items-start px-3 py-1.5 rounded-t border border-b-0 border-gray-300 bg-white -mb-px cursor-default`,
  repoOff: `flex flex-col items-start px-3 py-1.5 rounded-t border border-transparent text-gray-600 hover:bg-gray-50 cursor-pointer`,
  repoName: `text-xs font-medium text-gray-900`,
  repoState: `text-[10px] text-gray-500`,
  repoBody: `px-4 py-3 flex flex-col gap-1`,
};
