import { listConventionChangesForConvention } from '@/api/convention-changes';
import { ConventionChangesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads the current convention's change history (merged into the ledger dump).
 */
export const getConventionHistoryThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const conventionId = getState().currentConvention.id;
  if (!conventionId) return 400;
  const response = await listConventionChangesForConvention(conventionId);
  if (!response.success || !response.data) return 500;
  dispatch(ConventionChangesActions.upsertChanges(response.data));
  return 200;
};
