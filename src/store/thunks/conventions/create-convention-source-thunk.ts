import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { CurrentConventionActions } from '../../current';
import { ConventionBuilderActions } from '../../builders';
import { createConventionSource } from '@/api/conventions';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Adds conventionBuilder.sourceDraft to the current convention.
 */
export const createConventionSourceThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { id } = getState().currentConvention.convention;
    const draft = getState().conventionBuilder.sourceDraft;
    if (!id || !draft.repo.trim() || !draft.adr_path.trim()) return 400;
    try {
      const response = await createConventionSource(
        id,
        { repo: draft.repo.trim(), adr_path: draft.adr_path.trim(), excerpt: draft.excerpt.trim() },
        getApiBaseUrl()
      );
      if (!response.success || !response.data) {
        dispatch(ConventionBuilderActions.setError(response.error ?? 'Failed to add source'));
        return 400;
      }
      dispatch(CurrentConventionActions.addSource(response.data));
      dispatch(ConventionBuilderActions.resetSourceDraft());
      return 200;
    } catch (error) {
      console.error('Error adding source:', error);
      return 500;
    }
  };
};
