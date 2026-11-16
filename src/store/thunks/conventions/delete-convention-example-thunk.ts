import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { CurrentConventionActions } from '../../current';
import { deleteConventionExample } from '@/api/conventions';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Deletes one example from the current convention.
 */
export const deleteConventionExampleThunk = (exampleId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    if (!exampleId) return 400;
    try {
      const response = await deleteConventionExample(exampleId, getApiBaseUrl());
      if (!response.success) return 400;
      dispatch(CurrentConventionActions.removeExample(exampleId));
      return 200;
    } catch (error) {
      console.error('Error deleting example:', error);
      return 500;
    }
  };
};
