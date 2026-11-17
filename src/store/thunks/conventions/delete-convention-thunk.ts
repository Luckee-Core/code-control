import { deleteConvention } from '@/api/conventions';
import { CurrentConventionActions } from '../../current';
import { ConventionsActions, ConventionsCatalogActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Deletes the current convention (examples and sources cascade server-side).
 */
export const deleteConventionThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const { id } = getState().currentConvention;
    if (!id) return 400;
    const response = await deleteConvention(id);
    if (!response.success) {
      console.error('❌ Failed to delete convention:', response.error);
      return 500;
    }
    dispatch(ConventionsActions.deleteConvention(id));
    dispatch(ConventionsCatalogActions.setConventionRoleLinks({ conventionId: id, links: [] }));
    dispatch(CurrentConventionActions.reset());
    return 200;
  };
};
