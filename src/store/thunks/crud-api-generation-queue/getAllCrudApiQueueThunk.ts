import type { AppThunk } from '@/store';
import { getAllCrudApiQueue } from '@/api/crud-api-generation-queue';
import { CrudApiQueueActions } from '@/store/dumps/crudApiGenerationQueue';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllCrudApiQueueThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const result = await getAllCrudApiQueue(getApiBaseUrl());

      if (result.success && result.data) {
        dispatch(CrudApiQueueActions.setCrudApiQueue(result.data));
        return 200;
      }

      console.error('Failed to fetch CRUD API queue:', result.error);
      return 400;
    } catch (error) {
      console.error('Error in getAllCrudApiQueueThunk:', error);
      return 500;
    }
  };
};
