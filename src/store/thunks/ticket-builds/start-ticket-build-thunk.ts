import { startTicketBuild } from '@/api/ticket-builds';
import { TicketBuildBuilderActions } from '../../builders';
import { CurrentTicketBuildActions } from '../../current';
import { TicketBuildsActions } from '../../dumps';
import { getTicketBuildReposByBuildIdThunk } from './get-ticket-build-repos-by-build-id-thunk';
import type { AppThunk } from '../../types';

/** Approves the current build's plan and starts the agents; then reloads its repos. */
export const startTicketBuildThunk = (): AppThunk<Promise<202 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const id = getState().currentTicketBuild.id;
    if (!id) return 400;
    dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'submitting' }));
    const response = await startTicketBuild(id);
    if (!response.success || !response.data) {
      dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not start the build' }));
      return 500;
    }
    dispatch(TicketBuildsActions.upsertTicketBuild(response.data));
    dispatch(CurrentTicketBuildActions.setCurrentTicketBuild(response.data));
    dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'idle' }));
    await dispatch(getTicketBuildReposByBuildIdThunk(id));
    return 202;
  };
};
