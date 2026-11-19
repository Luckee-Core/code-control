import { updateTicketBuildContract } from '@/api/ticket-builds';
import { TicketBuildBuilderActions } from '../../builders';
import { CurrentTicketBuildActions } from '../../current';
import { TicketBuildsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Saves the shared contract of the current build. */
export const updateTicketBuildContractThunk = (contractText: string): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const id = getState().currentTicketBuild.id;
    if (!id) return 400;
    const response = await updateTicketBuildContract(id, contractText);
    if (!response.success || !response.data) {
      dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not save the contract' }));
      return 500;
    }
    dispatch(TicketBuildsActions.upsertTicketBuild(response.data));
    dispatch(CurrentTicketBuildActions.setCurrentTicketBuild(response.data));
    return 200;
  };
};
