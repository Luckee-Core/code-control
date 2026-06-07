import { AppThunk } from '@/store';
import { deleteARDQueueItem } from '@/api/ard-generation-queue';
import { ARDGenerationQueueActions } from '@/store/dumps/ardGenerationQueue';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteARDQueueItemThunk = (queueItemId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteARDQueueItem(queueItemId);

      if (response.success) {
        dispatch(ARDGenerationQueueActions.deleteARDGenerationTask(queueItemId));
        return 200;
      }

      console.error('Failed to delete ARD queue item:', response.error);
      return 400;
    } catch (error) {
      console.error('Error deleting ARD queue item:', error);
      return 500;
    }
  };
};
