import { continueSystemBuildRun } from '@/api/system-build-runs';
import { SystemBuildRunBuilderActions } from '../../builders';
import type { AppThunk } from '../../types';
import { storeSystemBuildRunDetailThunk } from './store-system-build-run-detail-thunk';

/** Resumes a paused or failed run at the step that stopped it. */
export const continueSystemBuildRunThunk = (id: string): AppThunk<Promise<202 | 500>> => {
  return async (dispatch) => {
    dispatch(SystemBuildRunBuilderActions.setSubmitStatus({ status: 'submitting' }));
    const response = await continueSystemBuildRun(id);
    if (!response.success || !response.data) {
      dispatch(SystemBuildRunBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not continue the build' }));
      return 500;
    }
    dispatch(storeSystemBuildRunDetailThunk(response.data));
    dispatch(SystemBuildRunBuilderActions.setSubmitStatus({ status: 'idle' }));
    return 202;
  };
};
