import { getSoftwareSystemAiCalls } from '@/api/software-systems';
import { SoftwareSystemAiCallsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Loads every AI call made for the current software system (AI costs tab). */
export const getSoftwareSystemAiCallsThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const softwareSystemId = getState().currentSoftwareSystem.id;
    if (!softwareSystemId) return 400;
    const response = await getSoftwareSystemAiCalls(softwareSystemId);
    if (!response.success || !response.data) return 500;
    dispatch(SoftwareSystemAiCallsActions.setForSoftwareSystem({ softwareSystemId, calls: response.data }));
    return 200;
  };
};
