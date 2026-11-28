'use client';

import type { SystemBuildRepoPhase, SystemBuildRepoProgress } from '@/model/system-build-run-step';
import { ACTIVE_PHASES, PHASE_LABEL } from '../../../config';

type RepoRowProps = {
  repo: SystemBuildRepoProgress;
};

/** One repo inside a tab card: role, what it is doing now, file count and its PR. */
export const RepoRow = ({ repo }: RepoRowProps) => {
  const isActive = ACTIVE_PHASES.has(repo.phase);
  const label = repo.phase === 'committing' && repo.files ? `Committing ${repo.files} files` : PHASE_LABEL[repo.phase];

  return (
    <li className={styles.row}>
      {isActive ? <span className={styles.spinner} aria-hidden /> : <span className={MARK_STYLE[repo.phase]} aria-hidden>{MARK[repo.phase]}</span>}
      <div className={styles.body}>
        <div className={styles.line}>
          <span className={styles.role}>{repo.role}</span>
          <span className={styles.repo} title={repo.repo}>
            {repo.repo}
          </span>
        </div>
        <div className={styles.line}>
          <span className={isActive ? styles.phaseActive : PHASE_STYLE[repo.phase]}>{label}</span>
          {repo.files && repo.phase !== 'committing' ? <span className={styles.meta}>{repo.files} files</span> : null}
          {repo.pr_url && repo.pr_number ? (
            <a href={repo.pr_url} target="_blank" rel="noreferrer" className={styles.pr}>
              #{repo.pr_number}
            </a>
          ) : null}
        </div>
        {repo.error && repo.phase !== 'merged' ? <p className={styles.error}>{repo.error}</p> : null}
      </div>
    </li>
  );
};

const MARK: Record<SystemBuildRepoPhase, string> = {
  queued: '○',
  checking: '',
  rendering: '',
  committing: '',
  opening_pr: '',
  merging: '',
  merged: '✓',
  unchanged: '✓',
  open: '⏸',
  failed: '✗',
};

const MARK_BASE = 'w-4 h-4 shrink-0 mt-0.5 text-center text-xs font-bold leading-4';

const MARK_STYLE: Record<SystemBuildRepoPhase, string> = {
  queued: `${MARK_BASE} text-gray-300`,
  checking: MARK_BASE,
  rendering: MARK_BASE,
  committing: MARK_BASE,
  opening_pr: MARK_BASE,
  merging: MARK_BASE,
  merged: `${MARK_BASE} text-green-600`,
  unchanged: `${MARK_BASE} text-gray-400`,
  open: `${MARK_BASE} text-amber-600`,
  failed: `${MARK_BASE} text-red-600`,
};

const PHASE_BASE = 'text-[11px]';

const PHASE_STYLE: Record<SystemBuildRepoPhase, string> = {
  queued: `${PHASE_BASE} text-gray-400`,
  checking: PHASE_BASE,
  rendering: PHASE_BASE,
  committing: PHASE_BASE,
  opening_pr: PHASE_BASE,
  merging: PHASE_BASE,
  merged: `${PHASE_BASE} text-green-700 font-medium`,
  unchanged: `${PHASE_BASE} text-gray-500`,
  open: `${PHASE_BASE} text-amber-700 font-medium`,
  failed: `${PHASE_BASE} text-red-700 font-medium`,
};

const styles = {
  row: `flex items-start gap-2 py-1.5`,
  spinner: `w-4 h-4 shrink-0 mt-0.5 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin`,
  body: `flex flex-col min-w-0 flex-1`,
  line: `flex items-center gap-1.5 min-w-0`,
  role: `text-[11px] font-semibold text-gray-900 capitalize shrink-0`,
  repo: `text-[11px] font-mono text-gray-400 truncate`,
  phaseActive: `text-[11px] text-blue-700 font-medium`,
  meta: `text-[11px] text-gray-500 tabular-nums`,
  pr: `text-[11px] font-medium text-blue-700 hover:underline`,
  error: `text-[11px] text-red-700 leading-snug break-words mt-0.5`,
};
