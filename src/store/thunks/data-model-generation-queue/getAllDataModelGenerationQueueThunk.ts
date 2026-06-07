import { AppThunk } from '../../types';
import { DataModelQueueActions } from '../../dumps';
import { getAllDataModelQueue } from '@/api/data-model-generation-queue';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllDataModelGenerationQueueThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllDataModelQueue(getApiBaseUrl());
      
      if (response.success && response.data) {
        dispatch(DataModelQueueActions.setDataModelQueue(response.data));
        return 200;
      }
      
      return 400;
    } catch (error) {
      console.error('Error fetching all data model generation queue:', error);
      return 500;
    }
  };
};
