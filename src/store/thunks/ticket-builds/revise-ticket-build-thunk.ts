import { reviseTicketBuild } from '@/api/ticket-builds';
import { TicketBuildBuilderActions } from '../../builders';
import { CurrentTicketBuildActions } from '../../current';
import { TicketBuildsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Re-plans the current build with the feedback draft. */
export const reviseTicketBuildThunk = (): AppThunk<Promise<202 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const id = getState().currentTicketBuild.id;
    if (!id) return 400;
    dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'submitting' }));
    const response = await reviseTicketBuild(id, getState().ticketBuildBuilder.feedbackDraft);
    if (!response.success || !response.data) {
      dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not revise' }));
      return 500;
    }
    dispatch(TicketBuildsActions.upsertTicketBuild(response.data));
    dispatch(CurrentTicketBuildActions.setCurrentTicketBuild(response.data));
    dispatch(TicketBuildBuilderActions.setFeedbackDraft(''));
    dispatch(TicketBuildBuilderActions.setReviseOpen(false));
    dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'idle' }));
    return 202;
  };
};
