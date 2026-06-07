import type { AppThunk } from '@/store';
import { updateCrudApiQueueStatus } from '@/api/crud-api-generation-queue';
import { CrudApiQueueActions } from '@/store/dumps/crudApiGenerationQueue';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const retryCrudApiQueueItemThunk = (queueItemId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const result = await updateCrudApiQueueStatus(
        queueItemId,
        { status: 'queued', error: null },
        getApiBaseUrl()
      );

      if (result.success && result.data) {
        dispatch(CrudApiQueueActions.updateCrudApiQueueItem(result.data));
        return 200;
      }

      console.error('Failed to retry CRUD API queue item:', result.error);
      return 400;
    } catch (error) {
      console.error('Error in retryCrudApiQueueItemThunk:', error);
      return 500;
    }
  };
};
