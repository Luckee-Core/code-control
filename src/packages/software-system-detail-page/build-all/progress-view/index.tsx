'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { SystemBuildRunBuilderActions } from '@/store/builders';
import { cancelSystemBuildRunThunk, continueSystemBuildRunThunk } from '@/store/thunks/system-build-runs';
import { RUN_BADGE, RUN_FILL, RUN_LABEL, stepFraction } from '../config';
import { Activity } from './activity';
import { Bar } from './bar';
import { Elapsed } from './elapsed';
import { StepCard } from './step-card';

type ProgressViewProps = {
  runId: string;
};

/**
 * Full-screen In progress view of one Build all run: an overall bar and clock, a card per tab
 * with each repo's live phase (rendering, committing, opening the PR, merging), and an activity
 * feed. Escape or Close returns to the page; the run keeps going.
 */
export const ProgressView = ({ runId }: ProgressViewProps) => {
  const dispatch = useAppDispatch();
  const runsById = useAppSelector((state) => state.systemBuildRuns);
  const stepsById = useAppSelector((state) => state.systemBuildRunSteps);
  const proposalsById = useAppSelector((state) => state.dataModelProposals);
  const system = useAppSelector((state) => state.currentSoftwareSystem);
  const isBusy = useAppSelector((state) => state.systemBuildRunBuilder.submitStatus === 'submitting');

  const run = runsById[runId] ?? null;
  const steps = useMemo(
    () => Object.values(stepsById).filter((step) => step.run_id === runId).sort((a, b) => a.position - b.position),
    [stepsById, runId],
  );
  const summary = useMemo(() => {
    const counted = steps.filter((step) => step.status !== 'skipped');
    const fraction = counted.length > 0 ? counted.reduce((sum, step) => sum + stepFraction(step), 0) / counted.length : 0;
    const repos = steps.flatMap((step) => step.progress?.repos ?? []);
    const merged = repos.filter((repo) => repo.phase === 'merged');
    return {
      fraction,
      tabsDone: counted.filter((step) => step.status === 'merged').length,
      tabsTotal: counted.length,
      prsMerged: merged.length,
      files: merged.reduce((sum, repo) => sum + (repo.files ?? 0), 0),
    };
  }, [steps]);
  const version = run ? proposalsById[run.proposal_id]?.version ?? null : null;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dispatch(SystemBuildRunBuilderActions.setProgressOpen(false));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  if (!run) return null;

  const isRunning = run.status === 'running';
  const isDone = run.status === 'completed';
  const canContinue = run.status === 'paused' || run.status === 'failed';
  const percent = Math.round((isDone ? 1 : summary.fraction) * 100);
  const title = isDone ? `Built ${system.name}` : isRunning ? `Building ${system.name}` : system.name;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Build all progress">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.eyebrow}>Build all{version ? ` · data model v${version}` : ''}</span>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{title}</h1>
              <span className={RUN_BADGE[run.status]}>{RUN_LABEL[run.status]}</span>
            </div>
            <p className={styles.subtitle}>Every tab delivered in order, one pull request per repo, each squash-merged before the next tab starts.</p>
          </div>
          <div className={styles.actions}>
            <Elapsed startedAt={run.started_at} stoppedAt={isRunning ? null : (run.finished_at ?? run.updated_at)} />
            {canContinue ? (
              <button type="button" onClick={() => void dispatch(continueSystemBuildRunThunk(run.id))} disabled={isBusy} className={detailPageStyles.primaryButton}>
                Continue
              </button>
            ) : null}
            {isRunning || canContinue ? (
              <button type="button" onClick={() => void dispatch(cancelSystemBuildRunThunk(run.id))} disabled={isBusy} className={detailPageStyles.secondaryButton}>
                Cancel
              </button>
            ) : null}
            <button type="button" onClick={() => dispatch(SystemBuildRunBuilderActions.setProgressOpen(false))} className={detailPageStyles.secondaryButton}>
              Close
            </button>
          </div>
        </header>

        <section className={styles.overall}>
          <div className={styles.overallTop}>
            <div className={styles.stats}>
              <Stat label="Tabs" value={`${summary.tabsDone} / ${summary.tabsTotal}`} />
              <Stat label="PRs merged" value={String(summary.prsMerged)} />
              <Stat label="Files written" value={String(summary.files)} />
            </div>
            <span className={styles.percent}>{percent}%</span>
          </div>
          <Bar fraction={isDone ? 1 : summary.fraction} fill={RUN_FILL[run.status]} isActive={isRunning} size="lg" />
          {run.error ? <p className={styles.runError}>{run.error}</p> : null}
        </section>

        <section className={styles.grid}>
          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} number={index + 1} isCurrent={isRunning && step.status === 'running'} />
          ))}
        </section>

        <Activity runId={run.id} />
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.stat}>
    <span className={styles.statValue}>{value}</span>
    <span className={styles.statLabel}>{label}</span>
  </div>
);

const styles = {
  overlay: `fixed inset-0 z-50 bg-gray-50 overflow-y-auto`,
  inner: `max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6`,
  header: `flex flex-wrap items-start justify-between gap-4`,
  titleBlock: `flex flex-col gap-1 min-w-0`,
  eyebrow: `text-[11px] font-semibold uppercase tracking-wide text-gray-500`,
  titleRow: `flex flex-wrap items-center gap-3`,
  title: `text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900`,
  subtitle: `text-sm text-gray-500 max-w-2xl`,
  actions: `flex items-center gap-3`,
  overall: `bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-4`,
  overallTop: `flex items-end justify-between gap-4`,
  stats: `flex flex-wrap gap-8`,
  stat: `flex flex-col`,
  statValue: `text-xl font-semibold tabular-nums text-gray-900`,
  statLabel: `text-[11px] uppercase tracking-wide text-gray-500`,
  percent: `text-3xl font-semibold tabular-nums text-gray-900`,
  runError: `text-xs text-red-800 bg-red-50 border border-red-200 rounded px-3 py-2 break-words`,
  grid: `grid gap-4 sm:grid-cols-2 xl:grid-cols-4`,
};
