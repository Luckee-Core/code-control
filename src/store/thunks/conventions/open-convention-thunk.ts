import { getConventionDetail } from '@/api/conventions';
import type { Convention } from '@/model/convention';
import { ConventionsBuilderActions } from '../../builders';
import { CurrentConventionActions } from '../../current';
import { ConventionExamplesActions, ConventionSourcesActions } from '../../dumps';
import type { AppThunk } from '../../types';
import { applyConventionDetail } from './apply-convention-detail';

/**
 * Sets the current convention from a list row, then loads its roles, examples and sources.
 */
export const openConventionThunk = (convention: Convention): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    if (!convention.id) return 400;
    const links = getState().conventionsCatalog.convention_roles;
    dispatch(
      CurrentConventionActions.setConvention({
        ...convention,
        role_keys: links.filter((link) => link.convention_id === convention.id).map((link) => link.role_key),
      }),
    );
    dispatch(ConventionExamplesActions.reset());
    dispatch(ConventionSourcesActions.reset());
    dispatch(ConventionsBuilderActions.setLoadingDetail(true));

    const response = await getConventionDetail(convention.id);
    dispatch(ConventionsBuilderActions.setLoadingDetail(false));
    if (!response.success || !response.data) {
      console.error('❌ Failed to load convention detail:', response.error);
      return 500;
    }
    applyConventionDetail(dispatch, response.data);
    return 200;
  };
};
