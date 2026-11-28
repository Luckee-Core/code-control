import { recordSoftwareSystemOpen } from '@/api/software-systems';
import { RecentSoftwareSystemOpensActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Records that the current software system was opened, for the dashboard's recent projects.
 * A failure is logged and otherwise ignored; it never blocks the detail page.
 */
export const recordSoftwareSystemOpenThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const softwareSystemId = getState().currentSoftwareSystem.id;
    if (!softwareSystemId) return 400;
    const response = await recordSoftwareSystemOpen(softwareSystemId);
    if (!response.success || !response.data) {
      console.error('❌ Failed to record software system open:', response.error);
      return 500;
    }
    dispatch(
      RecentSoftwareSystemOpensActions.upsertRecentSoftwareSystemOpen({
        software_system_id: softwareSystemId,
        last_opened_at: response.data.opened_at,
      }),
    );
    return 200;
  };
};
