import type { DataModelDeliveryKind } from '@/model/data-model-delivery';
import type { SystemBuildRunStatus } from '@/model/system-build-run';
import type { SystemBuildRunStepStatus } from '@/model/system-build-run-step';
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

/** Poll while a run is running. */
export const POLL_MS = 5000;

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
