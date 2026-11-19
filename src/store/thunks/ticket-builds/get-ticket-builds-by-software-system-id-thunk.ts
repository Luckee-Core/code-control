import { listTicketBuildsBySoftwareSystemId } from '@/api/ticket-builds';
import { TicketBuildBuilderActions } from '../../builders';
import { TicketBuildsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Loads the current software system's builds. */
export const getTicketBuildsBySoftwareSystemIdThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const softwareSystemId = getState().currentSoftwareSystem.id;
    if (!softwareSystemId) return 400;
    dispatch(TicketBuildBuilderActions.setLoadingList(true));
    const response = await listTicketBuildsBySoftwareSystemId(softwareSystemId);
    dispatch(TicketBuildBuilderActions.setLoadingList(false));
    if (!response.success || !response.data) return 500;
    dispatch(TicketBuildsActions.setForSoftwareSystem({ softwareSystemId, builds: response.data }));
    return 200;
  };
};
