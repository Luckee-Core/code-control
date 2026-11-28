'use client';

import type { SystemBuildRunStep } from '@/model/system-build-run-step';
import { BAR_FILL, STEP_LABEL, STEP_TAB, formatElapsed, stepFraction } from '../../config';
import { Bar } from '../bar';
import { RepoRow } from './repo-row';

type StepCardProps = {
  step: SystemBuildRunStep;
  number: number;
  /** The step the run is on right now. */
  isCurrent: boolean;
};

/** One tab of the build: its bar, each repo's live phase, and why it stopped or was skipped. */
export const StepCard = ({ step, number, isCurrent }: StepCardProps) => {
  const repos = step.progress?.repos ?? [];
  const message = step.error ?? step.note;
  const took =
    step.started_at && step.finished_at && step.status === 'merged'
      ? formatElapsed(new Date(step.finished_at).getTime() - new Date(step.started_at).getTime())
      : null;

  return (
    <div className={`${styles.card} ${isCurrent ? styles.current : ''} ${step.status === 'skipped' ? styles.dim : ''}`}>
      <div className={styles.header}>
        <span className={NUMBER_STYLE[step.status]}>{step.status === 'merged' ? '✓' : number}</span>
        <span className={styles.tab}>{STEP_TAB[step.kind]}</span>
        <span className={STATUS_STYLE[step.status]}>{took ? `${STEP_LABEL[step.status]} · ${took}` : STEP_LABEL[step.status]}</span>
      </div>
      <Bar fraction={stepFraction(step)} fill={BAR_FILL[step.status]} isActive={step.status === 'running'} size="sm" />
      {repos.length > 0 ? (
        <ul className={styles.repos}>
          {repos.map((repo) => (
            <RepoRow key={repo.role} repo={repo} />
          ))}
        </ul>
      ) : step.status === 'pending' ? (
        <p className={styles.waiting}>Up next</p>
      ) : null}
      {message && step.status !== 'merged' ? <p className={step.error ? styles.error : styles.note}>{message}</p> : null}
    </div>
  );
};

const NUMBER = 'w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold';

const NUMBER_STYLE: Record<SystemBuildRunStep['status'], string> = {
  pending: `${NUMBER} bg-gray-100 text-gray-500`,
  running: `${NUMBER} bg-blue-600 text-white`,
  waiting_merge: `${NUMBER} bg-amber-500 text-white`,
  merged: `${NUMBER} bg-green-600 text-white`,
  skipped: `${NUMBER} bg-gray-100 text-gray-400`,
  failed: `${NUMBER} bg-red-600 text-white`,
};

const STATUS = 'ml-auto text-[11px] font-medium whitespace-nowrap';

const STATUS_STYLE: Record<SystemBuildRunStep['status'], string> = {
  pending: `${STATUS} text-gray-400`,
  running: `${STATUS} text-blue-700`,
  waiting_merge: `${STATUS} text-amber-700`,
  merged: `${STATUS} text-green-700`,
  skipped: `${STATUS} text-gray-400`,
  failed: `${STATUS} text-red-700`,
};

const styles = {
  card: `bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-3 min-w-0 transition-shadow duration-300`,
  current: `ring-2 ring-blue-500 border-transparent shadow-lg`,
  dim: `opacity-60`,
  header: `flex items-center gap-2 min-w-0`,
  tab: `text-sm font-semibold text-gray-900 truncate`,
  repos: `flex flex-col divide-y divide-gray-100`,
  waiting: `text-[11px] text-gray-400`,
  note: `text-[11px] text-gray-600 leading-relaxed`,
  error: `text-[11px] text-red-700 leading-relaxed break-words`,
};
