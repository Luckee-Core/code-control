import type { DataModelDeliveryKind } from '@/model/data-model-delivery';
import type { SystemBuildRunStatus } from '@/model/system-build-run';
import type { SystemBuildRepoPhase, SystemBuildRunStep, SystemBuildRunStepStatus } from '@/model/system-build-run-step';
import type { SoftwareSystemTab } from '@/store/builders';

/** The tab each delivery kind lives on (a step row opens it). */
export const STEP_TAB: Record<DataModelDeliveryKind, SoftwareSystemTab> = {
  model: 'Data model',
  crud: 'API',
  layout: 'Layout',
  list: 'Tables',
  detail: 'Detail pages',
  dashboard: 'Dashboard',
  dispatcher: 'Dispatcher',
};

/** Poll while a run is running (fast enough for the In progress view to move smoothly). */
export const POLL_MS = 1000;

const BADGE = 'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border';

export const RUN_BADGE: Record<SystemBuildRunStatus, string> = {
  running: `${BADGE} bg-blue-50 text-blue-700 border-blue-200`,
  paused: `${BADGE} bg-amber-50 text-amber-800 border-amber-200`,
  failed: `${BADGE} bg-red-50 text-red-700 border-red-200`,
  cancelled: `${BADGE} bg-gray-50 text-gray-500 border-gray-200`,
  completed: `${BADGE} bg-green-50 text-green-700 border-green-200`,
};

export const RUN_LABEL: Record<SystemBuildRunStatus, string> = {
  running: 'Building',
  paused: 'Paused',
  failed: 'Stopped',
  cancelled: 'Cancelled',
  completed: 'Built',
};

export const STEP_ICON: Record<SystemBuildRunStepStatus, string> = {
  pending: '○',
  running: '◐',
  waiting_merge: '⏸',
  merged: '✓',
  skipped: '–',
  failed: '✗',
};

export const STEP_LABEL: Record<SystemBuildRunStepStatus, string> = {
  pending: 'Waiting',
  running: 'Delivering…',
  waiting_merge: 'Needs merge',
  merged: 'Merged',
  skipped: 'Skipped',
  failed: 'Failed',
};

/** What a repo is doing right now (In progress view). */
export const PHASE_LABEL: Record<SystemBuildRepoPhase, string> = {
  queued: 'Queued',
  checking: 'Checking prerequisites',
  rendering: 'Rendering templates',
  committing: 'Committing',
  opening_pr: 'Opening pull request',
  merging: 'Squash-merging',
  merged: 'Merged',
  unchanged: 'Already merged',
  open: 'Needs merge',
  failed: 'Failed',
};

/** How far through its delivery each phase is, for the progress bars. */
const PHASE_WEIGHT: Record<SystemBuildRepoPhase, number> = {
  queued: 0,
  checking: 0.1,
  rendering: 0.3,
  committing: 0.55,
  opening_pr: 0.7,
  merging: 0.85,
  merged: 1,
  unchanged: 1,
  open: 0.9,
  failed: 1,
};

export const ACTIVE_PHASES: ReadonlySet<SystemBuildRepoPhase> = new Set(['checking', 'rendering', 'committing', 'opening_pr', 'merging']);

/** 0–1 for one step: done steps are full, a running step averages its repos. */
export const stepFraction = (step: SystemBuildRunStep): number => {
  if (step.status === 'merged' || step.status === 'skipped') return 1;
  const repos = step.progress?.repos ?? [];
  if (repos.length === 0) return step.status === 'pending' ? 0 : 0.02;
  return repos.reduce((sum, repo) => sum + PHASE_WEIGHT[repo.phase], 0) / repos.length;
};

/** `2m 14s` / `48s`. */
export const formatElapsed = (ms: number): string => {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m ${String(seconds % 60).padStart(2, '0')}s` : `${seconds}s`;
};

/** Fill color of a step's bar by status. */
export const BAR_FILL: Record<SystemBuildRunStepStatus, string> = {
  pending: 'bg-gray-300',
  running: 'bg-blue-600',
  waiting_merge: 'bg-amber-500',
  merged: 'bg-green-600',
  skipped: 'bg-gray-300',
  failed: 'bg-red-600',
};

export const RUN_FILL: Record<SystemBuildRunStatus, string> = {
  running: 'bg-blue-600',
  paused: 'bg-amber-500',
  failed: 'bg-red-600',
  cancelled: 'bg-gray-400',
  completed: 'bg-green-600',
};
