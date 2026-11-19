import { createTicketBuild } from '@/api/ticket-builds';
import { TicketBuildBuilderActions } from '../../builders';
import { CurrentTicketBuildActions } from '../../current';
import { TicketBuildsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Creates (or opens the active) build for an ops ticket and makes it current. Returns the error
 * message on failure so the start page can offer a software-system picker.
 */
export const createTicketBuildThunk = (
  opsTicketId: string,
  softwareSystemId: string | null,
): AppThunk<Promise<{ ok: true } | { ok: false; error: string }>> => {
  return async (dispatch) => {
    dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'submitting' }));
    const response = await createTicketBuild(opsTicketId, softwareSystemId);
    if (!response.success || !response.data) {
      const error = response.error ?? 'Could not start the build';
      dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'error', error }));
      return { ok: false, error };
    }
    dispatch(TicketBuildsActions.upsertTicketBuild(response.data));
    dispatch(CurrentTicketBuildActions.setCurrentTicketBuild(response.data));
    dispatch(TicketBuildBuilderActions.setSubmitStatus({ status: 'idle' }));
    return { ok: true };
  };
};
