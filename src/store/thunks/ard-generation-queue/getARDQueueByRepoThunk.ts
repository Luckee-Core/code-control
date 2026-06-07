import { AppThunk } from '@/store';
import { getARDQueueByRepo } from '@/api/ard-generation-queue';
import { ARDGenerationQueueActions } from '@/store/dumps';

type ResponseType = Promise<200 | 400 | 500>;

export const getARDQueueByRepoThunk = (repoId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getARDQueueByRepo(repoId);
      
      if (!response.success) {
        console.error('Failed to fetch ARD queue:', response.error);
        return 500;
      }

      dispatch(ARDGenerationQueueActions.setARDGenerationQueue(response.data || []));
      return 200;
    } catch (error) {
      console.error('Error fetching ARD queue:', error);
      return 500;
    }
  };
};
