import { listTicketBuildRepos } from '@/api/ticket-builds';
import { TicketBuildReposActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Loads one build's repos into the ticketBuildRepos dump. */
export const getTicketBuildReposByBuildIdThunk = (ticketBuildId: string): AppThunk<Promise<200 | 500>> => {
  return async (dispatch) => {
    const response = await listTicketBuildRepos(ticketBuildId);
    if (!response.success || !response.data) return 500;
    dispatch(TicketBuildReposActions.setForBuild({ ticketBuildId, repos: response.data }));
    return 200;
  };
};
