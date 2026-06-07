import { AppThunk } from '../../types';
import { ARDGenerationQueueActions } from '../../dumps';
import { getAllARDQueue } from '@/api/ard-generation-queue';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllARDGenerationQueueThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllARDQueue(getApiBaseUrl());
      
      if (response.success && response.data) {
        dispatch(ARDGenerationQueueActions.setARDGenerationQueue(response.data));
        return 200;
      }
      
      return 400;
    } catch (error) {
      console.error('Error fetching all ARD generation queue:', error);
      return 500;
    }
  };
};
