import type { AppThunk } from '@/store';
import { deleteCrudApiQueueItem } from '@/api/crud-api-generation-queue';
import { CrudApiQueueActions } from '@/store/dumps/crudApiGenerationQueue';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteCrudApiQueueItemThunk = (queueItemId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const result = await deleteCrudApiQueueItem(queueItemId, getApiBaseUrl());

      if (result.success) {
        dispatch(CrudApiQueueActions.deleteCrudApiQueueItem(queueItemId));
        return 200;
      }

      console.error('Failed to delete CRUD API queue item:', result.error);
      return 400;
    } catch (error) {
      console.error('Error in deleteCrudApiQueueItemThunk:', error);
      return 500;
    }
  };
};
