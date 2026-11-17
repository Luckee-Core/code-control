import { setConventionStatus } from '@/api/conventions';
import type { ConventionStatus } from '@/model/convention';
import type { AppThunk } from '../../types';
import { applyConventionDetail } from './apply-convention-detail';

/**
 * Activates, deprecates, or returns the current convention to draft.
 */
export const setConventionStatusThunk = (status: ConventionStatus): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const { id } = getState().currentConvention;
    if (!id) return 400;
    const response = await setConventionStatus(id, status);
    if (!response.success || !response.data) {
      console.error('❌ Failed to change convention status:', response.error);
      return 500;
    }
    applyConventionDetail(dispatch, response.data);
    return 200;
  };
};
