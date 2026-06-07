import { AppThunk } from '@/store';
import { updateARDQueueStatus } from '@/api/ard-generation-queue';
import { ARDGenerationQueueActions } from '@/store/dumps';

type ResponseType = Promise<200 | 400 | 500>;

export const retryARDQueueItemThunk = (queueItemId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateARDQueueStatus(queueItemId, {
        status: 'queued',
      });

      if (!response.success || !response.data) {
        console.error('Failed to retry ARD queue item:', response.error);
        return 500;
      }

      dispatch(ARDGenerationQueueActions.updateARDGenerationTask(response.data));
      return 200;
    } catch (error) {
      console.error('Error retrying ARD queue item:', error);
      return 500;
    }
  };
};
