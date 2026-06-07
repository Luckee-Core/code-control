import { AppThunk } from '@/store';
import { updateDataModelQueueStatus } from '@/api/data-model-generation-queue';
import { DataModelQueueActions } from '@/store/dumps/dataModelGenerationQueue';

type ResponseType = Promise<200 | 400 | 500>;

export const retryDataModelQueueItemThunk = (queueItemId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateDataModelQueueStatus(queueItemId, {
        status: 'queued',
      });

      if (!response.success || !response.data) {
        console.error('Failed to retry data model queue item:', response.error);
        return 500;
      }

      dispatch(DataModelQueueActions.updateDataModelQueueItem(response.data));
      return 200;
    } catch (error) {
      console.error('Error retrying data model queue item:', error);
      return 500;
    }
  };
};
