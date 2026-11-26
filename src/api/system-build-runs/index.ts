import type { SystemBuildRun } from '@/model/system-build-run';
import type { SystemBuildRunEvent } from '@/model/system-build-run-event';
import type { SystemBuildRunStep } from '@/model/system-build-run-step';
import { requestJson } from '../request-json';

const BASE = '/api/data/system-build-runs';

/** A build run with its steps (tab order) and log (oldest first). */
export type SystemBuildRunDetail = {
  run: SystemBuildRun;
  steps: SystemBuildRunStep[];
  events: SystemBuildRunEvent[];
};

/** GET /api/data/system-build-runs?software_system_id= — newest first */
export const listSystemBuildRuns = (softwareSystemId: string) =>
  requestJson<SystemBuildRun[]>(`${BASE}?software_system_id=${encodeURIComponent(softwareSystemId)}`);

/** POST /api/data/system-build-runs { proposal_id } — starts "Build all" in the background */
export const createSystemBuildRun = (proposalId: string) =>
  requestJson<SystemBuildRunDetail>(BASE, { method: 'POST', body: { proposal_id: proposalId } });

/** GET /api/data/system-build-runs/:id — polling target */
export const getSystemBuildRun = (id: string) => requestJson<SystemBuildRunDetail>(`${BASE}/${encodeURIComponent(id)}`);

/** POST /api/data/system-build-runs/:id/continue — resumes a paused or failed run */
export const continueSystemBuildRun = (id: string) =>
  requestJson<SystemBuildRunDetail>(`${BASE}/${encodeURIComponent(id)}/continue`, { method: 'POST' });

/** POST /api/data/system-build-runs/:id/cancel */
export const cancelSystemBuildRun = (id: string) =>
  requestJson<SystemBuildRunDetail>(`${BASE}/${encodeURIComponent(id)}/cancel`, { method: 'POST' });
