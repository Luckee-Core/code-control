import { updateTicketBuildRepo } from '@/api/ticket-builds';
import { TicketBuildBuilderActions } from '../../builders';
import { TicketBuildReposActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Saves one repo's plan text and/or include toggle. */
export const updateTicketBuildRepoThunk = (
  id: string,
  input: { planText?: string; included?: boolean },
): AppThunk<Promise<200 | 500>> => {
  return async (dispatch) => {
    const response = await updateTicketBuildRepo(id, input);
    if (!response.success || !response.data) {
      dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not save the repo plan' }));
      return 500;
    }
    dispatch(TicketBuildReposActions.upsertTicketBuildRepo(response.data));
    return 200;
  };
};
