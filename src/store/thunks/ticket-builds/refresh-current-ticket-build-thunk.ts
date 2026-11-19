import { getTicketBuild } from '@/api/ticket-builds';
import { CurrentTicketBuildActions } from '../../current';
import { TicketBuildsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Re-fetches the current build (the server syncs agents and PRs on this read). */
export const refreshCurrentTicketBuildThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const id = getState().currentTicketBuild.id;
    if (!id) return 400;
    const response = await getTicketBuild(id);
    if (!response.success || !response.data) return 500;
    dispatch(TicketBuildsActions.upsertTicketBuild(response.data));
    if (getState().currentTicketBuild.id === id) dispatch(CurrentTicketBuildActions.setCurrentTicketBuild(response.data));
    return 200;
  };
};
