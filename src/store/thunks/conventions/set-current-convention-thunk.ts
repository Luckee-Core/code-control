import { AppThunk } from '../../types';
import { CurrentConventionActions } from '../../current';
import type { Convention } from '@/model/convention';

/**
 * Sets the current convention before navigating to the detail page.
 */
export const setCurrentConventionThunk = (convention: Convention): AppThunk<Promise<200 | 400>> => {
  return async (dispatch): Promise<200 | 400> => {
    if (!convention.id) return 400;
    dispatch(CurrentConventionActions.setConvention(convention));
    return 200;
  };
};
