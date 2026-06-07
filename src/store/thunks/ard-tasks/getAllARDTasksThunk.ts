import { AppThunk } from '@/store';
import { getAllARDTasks } from '@/api/ard-tasks';
import { ARDTasksActions } from '@/store/dumps';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllARDTasksThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      console.log('📦 Thunk: Calling getAllARDTasks API...');
      const response = await getAllARDTasks();
      
      console.log('📦 Thunk: API response:', response);
      
      if (!response.success) {
        console.error('📦 Thunk: Failed to fetch ARD tasks:', response.error);
        return 500;
      }

      console.log('📦 Thunk: Dispatching', response.data?.length, 'ARD tasks to Redux');
      dispatch(ARDTasksActions.setARDTasks(response.data || []));
      return 200;
    } catch (error) {
      console.error('📦 Thunk: Error fetching ARD tasks:', error);
      return 500;
    }
  };
};
