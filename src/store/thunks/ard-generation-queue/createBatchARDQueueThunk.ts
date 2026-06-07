import { AppThunk } from '@/store';
import { createBatchARDQueue, CreateBatchARDQueueInput } from '@/api/ard-generation-queue';
import { ARDGenerationQueueActions } from '@/store/dumps';

type ResponseType = Promise<200 | 400 | 500>;

export const createBatchARDQueueThunk = (input: CreateBatchARDQueueInput): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await createBatchARDQueue(input);
      
      if (!response.success || !response.data) {
        console.error('Failed to create ARD queue items:', response.error);
        return 500;
      }

      response.data.forEach((task) => {
        dispatch(ARDGenerationQueueActions.addARDGenerationTask(task));
      });
      
      return 200;
    } catch (error) {
      console.error('Error creating ARD queue items:', error);
      return 500;
    }
  };
};
