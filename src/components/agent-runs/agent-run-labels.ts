import type { AgentKind, AgentRunStatus } from '@/model/agent-run';

export const AGENT_LABEL: Record<AgentKind, string> = {
  pr: 'PR agent',
  convention: 'Convention agent',
  template: 'Template agent',
};

export const STATUS_LABEL: Record<AgentRunStatus, string> = {
  draft: 'Ready to run',
  running: 'Running',
  needs_review: 'Needs review',
  approved: 'Approved',
  rejected: 'Rejected',
  superseded: 'Superseded',
  dismissed: 'Dismissed',
  no_change: 'No change',
  failed: 'Failed',
};

const BASE = 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border whitespace-nowrap';

export const STATUS_BADGE: Record<AgentRunStatus, string> = {
  draft: `${BASE} bg-gray-50 text-gray-700 border-gray-300`,
  running: `${BASE} bg-blue-50 text-blue-700 border-blue-200 animate-pulse`,
  needs_review: `${BASE} bg-amber-50 text-amber-800 border-amber-200`,
  approved: `${BASE} bg-green-50 text-green-700 border-green-200`,
  rejected: `${BASE} bg-red-50 text-red-700 border-red-200`,
  superseded: `${BASE} bg-gray-50 text-gray-400 border-gray-200`,
  dismissed: `${BASE} bg-gray-50 text-gray-400 border-gray-200`,
  no_change: `${BASE} bg-gray-50 text-gray-500 border-gray-200`,
  failed: `${BASE} bg-red-50 text-red-700 border-red-200`,
};

/** Statuses a list can filter by, in lifecycle order. */
export const STATUS_FILTERS: AgentRunStatus[] = ['draft', 'running', 'needs_review', 'approved', 'rejected', 'no_change', 'failed', 'superseded', 'dismissed'];

export const PILL = `inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border`;
