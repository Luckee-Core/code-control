/**
 * Get All CRUD API Tasks Thunk
 * Fetches all CRUD API task templates from the backend
 */

import { AppThunk } from '@/store';
import { getAllCrudApiTasks } from '@/api/crud-api-tasks';
import { CrudApiTasksActions } from '@/store/dumps';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllCrudApiTasksThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const result = await getAllCrudApiTasks();

      if (!result.success || !result.data) {
        console.error('❌ Failed to fetch CRUD API tasks:', result.error);
        return 500;
      }

      dispatch(CrudApiTasksActions.setCrudApiTasks(result.data));
      return 200;
    } catch (error) {
      console.error('❌ Error in getAllCrudApiTasksThunk:', error);
      return 500;
    }
  };
};
