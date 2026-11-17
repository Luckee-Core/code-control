import { createConventionSource, deleteConventionSource } from '@/api/conventions';
import { ConventionsBuilderActions } from '../../builders';
import { ConventionSourcesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Saves the source draft from the builder onto the current convention.
 */
export const createConventionSourceThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const { id } = getState().currentConvention;
    const draft = getState().conventionsBuilder.sourceDraft;
    if (!id || !draft.repo.trim() || !draft.adr_path.trim()) return 400;
    const response = await createConventionSource(id, {
      repo: draft.repo.trim(),
      adr_path: draft.adr_path.trim(),
      excerpt: draft.excerpt.trim(),
    });
    if (!response.success || !response.data) {
      console.error('❌ Failed to add source:', response.error);
      return 500;
    }
    dispatch(ConventionSourcesActions.upsertSource(response.data));
    dispatch(ConventionsBuilderActions.closeSourceForm());
    return 200;
  };
};

/**
 * Deletes one source from the current convention.
 */
export const deleteConventionSourceThunk = (sourceId: string): AppThunk<Promise<200 | 500>> => {
  return async (dispatch) => {
    const response = await deleteConventionSource(sourceId);
    if (!response.success) {
      console.error('❌ Failed to delete source:', response.error);
      return 500;
    }
    dispatch(ConventionSourcesActions.deleteSource(sourceId));
    return 200;
  };
};
