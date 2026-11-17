import { getConventionsCatalog, listConventions } from '@/api/conventions';
import { ConventionsActions, ConventionsCatalogActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads all conventions and the conventions catalog (topics, roles, vocabulary) into dumps.
 */
export const getConventionsThunk = (): AppThunk<Promise<200 | 500>> => {
  return async (dispatch) => {
    const [conventions, catalog] = await Promise.all([listConventions(), getConventionsCatalog()]);
    if (!conventions.success || !catalog.success || !catalog.data) {
      console.error('❌ Failed to load conventions:', conventions.error ?? catalog.error);
      return 500;
    }
    dispatch(ConventionsActions.setConventions(conventions.data ?? []));
    dispatch(ConventionsCatalogActions.setCatalog(catalog.data));
    return 200;
  };
};
