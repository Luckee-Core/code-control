import type { TicketBuild } from '@/model/ticket-build';
import { TicketBuildBuilderActions } from '../../builders';
import { CurrentTicketBuildActions } from '../../current';
import type { AppThunk } from '../../types';

/** Opens a build on the detail page (call before navigating). */
export const setCurrentTicketBuildThunk = (build: TicketBuild): AppThunk<Promise<200>> => {
  return async (dispatch) => {
    dispatch(CurrentTicketBuildActions.setCurrentTicketBuild(build));
    dispatch(TicketBuildBuilderActions.reset());
    return 200;
  };
};
