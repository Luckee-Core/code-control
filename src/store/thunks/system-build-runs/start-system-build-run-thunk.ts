import { createSystemBuildRun } from '@/api/system-build-runs';
import { SystemBuildRunBuilderActions } from '../../builders';
import type { AppThunk } from '../../types';
import { storeSystemBuildRunDetailThunk } from './store-system-build-run-detail-thunk';

/** Starts "Build all" for the current software system's approved data model version. */
export const startSystemBuildRunThunk = (): AppThunk<Promise<202 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const state = getState();
    const softwareSystemId = state.currentSoftwareSystem.id;
    const approved = Object.values(state.dataModelProposals).find(
      (proposal) => proposal.software_system_id === softwareSystemId && proposal.status === 'approved',
    );
    if (!approved) {
      dispatch(SystemBuildRunBuilderActions.setSubmitStatus({ status: 'error', error: 'Approve a data model version first (Data model tab).' }));
      return 400;
    }
    dispatch(SystemBuildRunBuilderActions.setSubmitStatus({ status: 'submitting' }));
    const response = await createSystemBuildRun(approved.id);
    if (!response.success || !response.data) {
      dispatch(SystemBuildRunBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not start the build' }));
      return 500;
    }
    dispatch(storeSystemBuildRunDetailThunk(response.data));
    dispatch(SystemBuildRunBuilderActions.setSubmitStatus({ status: 'idle' }));
    return 202;
  };
};
