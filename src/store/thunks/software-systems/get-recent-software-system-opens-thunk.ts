import { getRecentSoftwareSystemOpens } from '@/api/software-systems';
import { RecentSoftwareSystemOpensActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads the most recently opened software systems (newest first, one per system).
 */
export const getRecentSoftwareSystemOpensThunk = (limit: number): AppThunk<Promise<200 | 500>> => {
  return async (dispatch) => {
    const response = await getRecentSoftwareSystemOpens(limit);
    if (!response.success || !response.data) {
      console.error('❌ Failed to load recent software systems:', response.error);
      return 500;
    }
    dispatch(RecentSoftwareSystemOpensActions.setRecentSoftwareSystemOpens(response.data));
    return 200;
  };
};
