import { AppThunk } from '@/store';
import { deleteDataModelQueueItem } from '@/api/data-model-generation-queue';
import { DataModelQueueActions } from '@/store/dumps/dataModelGenerationQueue';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteDataModelQueueItemThunk = (queueItemId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteDataModelQueueItem(queueItemId);

      if (response.success) {
        dispatch(DataModelQueueActions.deleteDataModelQueueItem(queueItemId));
        return 200;
      }

      console.error('Failed to delete data model queue item:', response.error);
      return 400;
    } catch (error) {
      console.error('Error deleting data model queue item:', error);
      return 500;
    }
  };
};
