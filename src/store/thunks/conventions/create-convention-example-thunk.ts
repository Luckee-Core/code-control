import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { CurrentConventionActions } from '../../current';
import { ConventionBuilderActions } from '../../builders';
import { createConventionExample } from '@/api/conventions';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Adds conventionBuilder.exampleDraft to the current convention.
 */
export const createConventionExampleThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { id } = getState().currentConvention.convention;
    const draft = getState().conventionBuilder.exampleDraft;
    if (!id || !draft.title.trim() || !draft.code.trim()) return 400;
    try {
      const response = await createConventionExample(
        id,
        {
          title: draft.title.trim(),
          kind: draft.kind,
          language: draft.language,
          code: draft.code,
          path_hint: draft.path_hint.trim() || null,
          note: draft.note.trim(),
        },
        getApiBaseUrl()
      );
      if (!response.success || !response.data) {
        dispatch(ConventionBuilderActions.setError(response.error ?? 'Failed to add example'));
        return 400;
      }
      dispatch(CurrentConventionActions.addExample(response.data));
      dispatch(ConventionBuilderActions.resetExampleDraft());
      return 200;
    } catch (error) {
      console.error('Error adding example:', error);
      return 500;
    }
  };
};
