import { createConventionExample, deleteConventionExample } from '@/api/conventions';
import { ConventionsBuilderActions } from '../../builders';
import { ConventionExamplesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Saves the example draft from the builder onto the current convention.
 */
export const createConventionExampleThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const { id } = getState().currentConvention;
    const draft = getState().conventionsBuilder.exampleDraft;
    if (!id || !draft.title.trim() || !draft.code.trim()) return 400;
    const response = await createConventionExample(id, {
      ...draft,
      title: draft.title.trim(),
      path_hint: draft.path_hint?.trim() || null,
    });
    if (!response.success || !response.data) {
      console.error('❌ Failed to add example:', response.error);
      return 500;
    }
    dispatch(ConventionExamplesActions.upsertExample(response.data));
    dispatch(ConventionsBuilderActions.closeExampleForm());
    return 200;
  };
};

/**
 * Deletes one example from the current convention.
 */
export const deleteConventionExampleThunk = (exampleId: string): AppThunk<Promise<200 | 500>> => {
  return async (dispatch) => {
    const response = await deleteConventionExample(exampleId);
    if (!response.success) {
      console.error('❌ Failed to delete example:', response.error);
      return 500;
    }
    dispatch(ConventionExamplesActions.deleteExample(exampleId));
    return 200;
  };
};
