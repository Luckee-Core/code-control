import { AppThunk } from '@/store';
import { createBatchDataModelQueue } from '@/api/data-model-generation-queue';
import { getApiBaseUrl } from '@/api/config';
import { DataModelQueueActions, DataModelBuilderActions } from '@/store';
import type { DataModelGenerationQueue } from '@/model';

type CreateBatchInput = {
  project_id: string;
  repo_id: string;
  entity_ids: string[];
};

type ResponseType = Promise<200 | 400 | 500>;

export const createBatchDataModelQueueThunk = (
  input: CreateBatchInput
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(DataModelBuilderActions.setIsGenerating(true));

      const response = await createBatchDataModelQueue(input, getApiBaseUrl());

      if (!response.success || !response.data) {
        console.error('❌ Failed to create batch data model queue');
        dispatch(DataModelBuilderActions.setIsGenerating(false));
        return 500;
      }

      // Add each queue item to Redux
      response.data.forEach((item: DataModelGenerationQueue) => {
        dispatch(DataModelQueueActions.addDataModelQueueItem(item));
      });

      // Clear selected entity IDs after successful creation
      dispatch(DataModelBuilderActions.setSelectedEntityIds([]));
      dispatch(DataModelBuilderActions.setIsGenerating(false));

      return 200;
    } catch (error) {
      console.error('❌ Error in createBatchDataModelQueueThunk:', error);
      dispatch(DataModelBuilderActions.setIsGenerating(false));
      return 500;
    }
  };
};
