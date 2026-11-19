import { listSetupPresets } from '@/api/setup-presets';
import { SetupPresetsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads the active project types (setup presets) into the dump.
 */
export const loadSetupPresetsThunk = (): AppThunk<Promise<200 | 500>> => async (dispatch) => {
  const response = await listSetupPresets();
  if (!response.success || !response.data) {
    console.error('❌ Failed to load project types:', response.error);
    return 500;
  }
  dispatch(SetupPresetsActions.setSetupPresets(response.data));
  return 200;
};
