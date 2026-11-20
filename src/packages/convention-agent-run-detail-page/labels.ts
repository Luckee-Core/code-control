import { PILL } from '@/components/agent-runs';
import type { ConventionChangeStatus, ConventionChangeVerdict } from '@/model/convention-change';

export const VERDICT_LABEL: Record<ConventionChangeVerdict, string> = {
  new: 'New',
  refines: 'Refines',
  conflicts: 'Conflicts',
  duplicate: 'Duplicate',
  wrong_scope: 'Wrong scope',
};

export const VERDICT_BADGE: Record<ConventionChangeVerdict, string> = {
  new: `${PILL} bg-blue-50 text-blue-700 border-blue-200`,
  refines: `${PILL} bg-indigo-50 text-indigo-700 border-indigo-200`,
  conflicts: `${PILL} bg-red-50 text-red-700 border-red-200`,
  duplicate: `${PILL} bg-gray-50 text-gray-600 border-gray-200`,
  wrong_scope: `${PILL} bg-amber-50 text-amber-800 border-amber-200`,
};

export const CHANGE_STATUS_BADGE: Record<ConventionChangeStatus, string> = {
  proposed: `${PILL} bg-amber-50 text-amber-800 border-amber-200`,
  applied: `${PILL} bg-green-50 text-green-700 border-green-200`,
  rejected: `${PILL} bg-red-50 text-red-700 border-red-200`,
  superseded: `${PILL} bg-gray-50 text-gray-400 border-gray-200`,
};

export const CHANGE_TYPE_LABEL: Record<string, string> = {
  create: 'New convention',
  refine: 'Refine',
  deprecate: 'Deprecate',
  activate: 'Activate',
  severity_change: 'Change severity',
  role_change: 'Change roles',
  example_add: 'Add example',
};
