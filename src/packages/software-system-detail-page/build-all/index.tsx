'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { SystemBuildRunBuilderActions } from '@/store/builders';
import { getDataModelProposalsThunk } from '@/store/thunks/data-model-proposals';
import {
  cancelSystemBuildRunThunk,
  continueSystemBuildRunThunk,
  getSystemBuildRunThunk,
  getSystemBuildRunsThunk,
  startSystemBuildRunThunk,
} from '@/store/thunks/system-build-runs';
import { POLL_MS, RUN_BADGE, RUN_LABEL } from './config';
import { Log } from './log';
import { ProgressView } from './progress-view';
import { Steps } from './steps';

/**
 * Build all: delivers the approved data model through every tab in order (Data model → API →
 * Layout → Tables → Detail pages → Dashboard → Dispatcher), squash-merging each PR. Shows the
 * newest run's steps; polls while it runs. Starting a run opens the full-screen In progress view.
 */
export const BuildAll = () => {
  const dispatch = useAppDispatch();
  const softwareSystemId = useAppSelector((state) => state.currentSoftwareSystem.id);
  const proposalsById = useAppSelector((state) => state.dataModelProposals);
  const proposalsLoadedFor = useAppSelector((state) => state.dataModelBuilder.softwareSystemId);
  const runsById = useAppSelector((state) => state.systemBuildRuns);
  const builder = useAppSelector((state) => state.systemBuildRunBuilder);

  useEffect(() => {
    if (softwareSystemId && proposalsLoadedFor !== softwareSystemId) void dispatch(getDataModelProposalsThunk());
  }, [dispatch, softwareSystemId, proposalsLoadedFor]);

  useEffect(() => {
    if (softwareSystemId && builder.softwareSystemId !== softwareSystemId) void dispatch(getSystemBuildRunsThunk());
  }, [dispatch, softwareSystemId, builder.softwareSystemId]);

  const approved = useMemo(
    () => Object.values(proposalsById).find((proposal) => proposal.software_system_id === softwareSystemId && proposal.status === 'approved'),
    [proposalsById, softwareSystemId],
  );
  const run = useMemo(
    () =>
      Object.values(runsById)
        .filter((item) => item.software_system_id === softwareSystemId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null,
    [runsById, softwareSystemId],
  );

  const runId = run?.id ?? null;
  const isRunning = run?.status === 'running';
  useEffect(() => {
    if (!runId || !isRunning) return;
    const timer = setInterval(() => void dispatch(getSystemBuildRunThunk(runId)), POLL_MS);
    return () => clearInterval(timer);
  }, [dispatch, runId, isRunning]);

  if (!softwareSystemId) return null;

  const isBusy = builder.submitStatus === 'submitting';
  const isActive = run?.status === 'running' || run?.status === 'paused';
  const canContinue = run?.status === 'paused' || run?.status === 'failed';
  const canCancel = run?.status === 'running' || run?.status === 'paused' || run?.status === 'failed';
  const subtitle = approved
    ? `Delivers data model v${approved.version} through every tab in order and squash-merges each pull request. It pauses if a merge does not go through.`
    : 'Approve a data model version in the Data model tab first.';

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h2 className={detailPageStyles.panelTitle}>Build all</h2>
            {run ? <span className={RUN_BADGE[run.status]}>{RUN_LABEL[run.status]}</span> : null}
          </div>
          <p className={detailPageStyles.panelSubtitle}>{subtitle}</p>
        </div>
        <div className={styles.actions}>
          {run ? (
            <button type="button" onClick={() => dispatch(SystemBuildRunBuilderActions.setProgressOpen(true))} className={detailPageStyles.secondaryButton}>
              {isActive ? 'Watch' : 'View progress'}
            </button>
          ) : null}
          {canContinue && run ? (
            <button type="button" onClick={() => void dispatch(continueSystemBuildRunThunk(run.id))} disabled={isBusy} className={detailPageStyles.primaryButton}>
              Continue
            </button>
          ) : null}
          {canCancel && run ? (
            <button type="button" onClick={() => void dispatch(cancelSystemBuildRunThunk(run.id))} disabled={isBusy} className={`${detailPageStyles.secondaryButton} ${styles.disabled}`}>
              Cancel
            </button>
          ) : null}
          {!isActive ? (
            <button type="button" onClick={() => void dispatch(startSystemBuildRunThunk())} disabled={!approved || isBusy} className={canContinue ? `${detailPageStyles.secondaryButton} ${styles.disabled}` : detailPageStyles.primaryButton}>
              {isBusy ? 'Starting…' : run ? 'Build again' : 'Build all'}
            </button>
          ) : null}
        </div>
      </div>
      {builder.submitError ? <p className={styles.submitError}>{builder.submitError}</p> : null}
      {run ? (
        <div className={`${detailPageStyles.panelBody} ${styles.body}`}>
          {run.error ? <p className={styles.runError}>{run.error}</p> : null}
          <Steps runId={run.id} />
          <Log runId={run.id} />
        </div>
      ) : null}
      {run && builder.isProgressOpen ? <ProgressView runId={run.id} /> : null}
    </section>
  );
};

const styles = {
  titleBlock: `flex flex-col gap-0.5 max-w-2xl`,
  titleRow: `flex items-center gap-2`,
  actions: `flex items-center gap-2`,
  disabled: `disabled:opacity-50 disabled:cursor-not-allowed`,
  body: `flex flex-col gap-3`,
  submitError: `px-4 py-2 text-xs text-red-700 bg-red-50 border-b border-red-200`,
  runError: `text-xs text-red-800 bg-red-50 border border-red-200 rounded px-3 py-2 break-words`,
};
