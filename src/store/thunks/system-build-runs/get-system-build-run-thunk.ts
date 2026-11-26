import { getSystemBuildRun } from '@/api/system-build-runs';
import type { AppThunk } from '../../types';
import { storeSystemBuildRunDetailThunk } from './store-system-build-run-detail-thunk';

/** Re-fetches one run with its steps and log (the polling target). */
export const getSystemBuildRunThunk = (id: string): AppThunk<Promise<200 | 500>> => {
  return async (dispatch) => {
    const response = await getSystemBuildRun(id);
    if (!response.success || !response.data) return 500;
    dispatch(storeSystemBuildRunDetailThunk(response.data));
    return 200;
  };
};
