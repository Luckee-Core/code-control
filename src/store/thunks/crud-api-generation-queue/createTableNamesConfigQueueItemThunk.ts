import type { AppThunk } from '@/store';
import { createTableNamesConfigQueueItem } from '@/api/crud-api-generation-queue/create-table-names-config';
import { getApiBaseUrl } from '@/api/config';
import { CrudApiQueueActions } from '@/store/dumps/crudApiGenerationQueue';
import { getAllCrudApiQueueThunk } from './getAllCrudApiQueueThunk';

type ResponseType = Promise<200 | 400 | 500>;

export const createTableNamesConfigQueueItemThunk = (
  repoId: string
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const result = await createTableNamesConfigQueueItem(
        repoId,
        getApiBaseUrl()
      );

      if (!result.success || !result.item) {
        console.error('❌ Failed to enqueue table names config:', result.error);
        return 400;
      }

      dispatch(CrudApiQueueActions.addCrudApiQueueItems([result.item]));
      await dispatch(getAllCrudApiQueueThunk());
      return 200;
    } catch (error) {
      console.error('❌ Error in createTableNamesConfigQueueItemThunk:', error);
      return 500;
    }
  };
};
