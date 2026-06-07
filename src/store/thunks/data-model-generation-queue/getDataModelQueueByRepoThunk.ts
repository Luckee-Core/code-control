import { AppThunk } from '@/store';
import { getDataModelQueueByRepo } from '@/api/data-model-generation-queue';
import { getApiBaseUrl } from '@/api/config';
import { DataModelQueueActions } from '@/store/dumps';

type ResponseType = Promise<200 | 400 | 500>;

export const getDataModelQueueByRepoThunk = (repoId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getDataModelQueueByRepo(repoId, getApiBaseUrl());

      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch data model queue');
        return 500;
      }

      dispatch(DataModelQueueActions.setDataModelQueue(response.data));
      return 200;
    } catch (error) {
      console.error('❌ Error in getDataModelQueueByRepoThunk:', error);
      return 500;
    }
  };
};
