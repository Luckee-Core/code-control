import type { TicketBuildStatus } from '@/model/ticket-build';
import type { TicketBuildRepoStatus } from '@/model/ticket-build-repo';

const BASE = 'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border';
const BLUE = `${BASE} bg-blue-50 text-blue-700 border-blue-200`;
const GRAY = `${BASE} bg-gray-50 text-gray-700 border-gray-300`;
const RED = `${BASE} bg-red-50 text-red-700 border-red-200`;
const GREEN = `${BASE} bg-green-50 text-green-700 border-green-200`;
const AMBER = `${BASE} bg-amber-50 text-amber-800 border-amber-200`;
const MUTED = `${BASE} bg-gray-50 text-gray-400 border-gray-200`;

export const BUILD_STATUS: Record<TicketBuildStatus, { label: string; className: string }> = {
  planning: { label: 'Planning', className: BLUE },
  plan_ready: { label: 'Plan ready', className: GRAY },
  plan_failed: { label: 'Plan failed', className: RED },
  building: { label: 'Building', className: BLUE },
  opened: { label: 'PRs open', className: GREEN },
  partial: { label: 'Partly open', className: AMBER },
  failed: { label: 'Failed', className: RED },
  merged: { label: 'Merged', className: GREEN },
};

export const REPO_STATUS: Record<TicketBuildRepoStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: GRAY },
  skipped: { label: 'Skipped', className: MUTED },
  running: { label: 'Agent running', className: BLUE },
  opened: { label: 'PR open', className: GREEN },
  merged: { label: 'Merged', className: GREEN },
  closed: { label: 'Closed', className: MUTED },
  failed: { label: 'Failed', className: RED },
};

/** True while the server is working (poll). */
export const isTicketBuildActive = (status: TicketBuildStatus): boolean => status === 'planning' || status === 'building';
