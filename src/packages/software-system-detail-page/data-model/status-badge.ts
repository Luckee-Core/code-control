import type { DataModelProposalStatus } from '@/model/data-model-proposal';

const BASE = 'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border';

export const STATUS_BADGE: Record<DataModelProposalStatus, string> = {
  running: `${BASE} bg-blue-50 text-blue-700 border-blue-200`,
  ready: `${BASE} bg-gray-50 text-gray-700 border-gray-300`,
  failed: `${BASE} bg-red-50 text-red-700 border-red-200`,
  approved: `${BASE} bg-green-50 text-green-700 border-green-200`,
  superseded: `${BASE} bg-gray-50 text-gray-400 border-gray-200`,
};

export const STATUS_LABEL: Record<DataModelProposalStatus, string> = {
  running: 'Generating',
  ready: 'Ready',
  failed: 'Failed',
  approved: 'Approved',
  superseded: 'Superseded',
};
