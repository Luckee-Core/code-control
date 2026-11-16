import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { ConventionVocabularyActions } from '../../dumps';
import { getConventionVocabulary } from '@/api/conventions';

type ResponseType = Promise<200 | 500>;

/**
 * Loads the data-model vocabulary tables.
 */
export const getConventionVocabularyThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getConventionVocabulary(getApiBaseUrl());
      if (!response.success || !response.data) {
        console.error('Failed to fetch vocabulary:', response.error);
        return 500;
      }
      dispatch(ConventionVocabularyActions.setConventionVocabulary(response.data));
      return 200;
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      return 500;
    }
  };
};
