import type { SetupPresetRepoResult } from '@/model/setup-preset';
import { requestJson } from '../request-json';

export type ApplySetupPresetResponse = {
  preset_key: string;
  results: SetupPresetRepoResult[];
};

/** POST …/software-system-setup/apply-preset { preset_key, owner? }: creates the type's missing repos */
export const applySetupPreset = (projectId: string, presetKey: string, owner?: string) =>
  requestJson<ApplySetupPresetResponse>(
    `/api/data/software-systems/${encodeURIComponent(projectId)}/software-system-setup/apply-preset`,
    { method: 'POST', body: { preset_key: presetKey, ...(owner ? { owner } : {}) } },
  );
