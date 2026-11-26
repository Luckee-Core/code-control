import { listSystemBuildRuns } from '@/api/system-build-runs';
import { SystemBuildRunBuilderActions } from '../../builders';
import { SystemBuildRunsActions } from '../../dumps';
import type { AppThunk } from '../../types';
import { getSystemBuildRunThunk } from './get-system-build-run-thunk';

/** Loads the current software system's build runs, then the newest one's steps and log. */
export const getSystemBuildRunsThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const softwareSystemId = getState().currentSoftwareSystem.id;
    if (!softwareSystemId) return 400;
    dispatch(SystemBuildRunBuilderActions.setLoading({ softwareSystemId, isLoading: true }));
    const response = await listSystemBuildRuns(softwareSystemId);
    if (!response.success || !response.data) {
      dispatch(SystemBuildRunBuilderActions.setLoading({ softwareSystemId, isLoading: false }));
      return 500;
    }
    dispatch(SystemBuildRunsActions.setForSoftwareSystem({ softwareSystemId, runs: response.data }));
    const newest = response.data[0];
    if (newest) await dispatch(getSystemBuildRunThunk(newest.id));
    dispatch(SystemBuildRunBuilderActions.setLoading({ softwareSystemId, isLoading: false }));
    return 200;
  };
};
