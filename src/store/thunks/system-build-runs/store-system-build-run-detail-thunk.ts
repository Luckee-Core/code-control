import type { SystemBuildRunDetail } from '@/api/system-build-runs';
import { SystemBuildRunEventsActions, SystemBuildRunsActions, SystemBuildRunStepsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Puts a run, its steps and its log into the dumps. */
export const storeSystemBuildRunDetailThunk = (detail: SystemBuildRunDetail): AppThunk<void> => {
  return (dispatch) => {
    dispatch(SystemBuildRunsActions.upsertSystemBuildRun(detail.run));
    dispatch(SystemBuildRunStepsActions.setForRun({ runId: detail.run.id, steps: detail.steps }));
    dispatch(SystemBuildRunEventsActions.setForRun({ runId: detail.run.id, events: detail.events }));
  };
};
