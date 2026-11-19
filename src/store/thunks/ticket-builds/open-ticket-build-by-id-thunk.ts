import { getTicketBuild } from '@/api/ticket-builds';
import { TicketBuildBuilderActions } from '../../builders';
import { CurrentTicketBuildActions } from '../../current';
import { TicketBuildsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Loads a build by id and makes it current (deep link from My Ops Tracker). */
export const openTicketBuildByIdThunk = (id: string): AppThunk<Promise<{ ok: true } | { ok: false; error: string }>> => {
  return async (dispatch) => {
    const response = await getTicketBuild(id);
    if (!response.success || !response.data) return { ok: false, error: response.error ?? 'Ticket build not found' };
    dispatch(TicketBuildsActions.upsertTicketBuild(response.data));
    dispatch(CurrentTicketBuildActions.setCurrentTicketBuild(response.data));
    dispatch(TicketBuildBuilderActions.reset());
    return { ok: true };
  };
};
