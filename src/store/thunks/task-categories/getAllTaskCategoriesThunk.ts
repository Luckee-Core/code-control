import { AppThunk } from '@/store';
import { getAllTaskCategories } from '@/api/task-categories';
import { TaskCategoriesActions } from '@/store/dumps/taskCategories';

export const getAllTaskCategoriesThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      console.log('🔍 Fetching all task categories');
      const response = await getAllTaskCategories();

      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch task categories:', response.error);
        return 500;
      }

      dispatch(TaskCategoriesActions.setTaskCategories(response.data));
      console.log(`✅ Loaded ${response.data.length} task categories`);
      return 200;
    } catch (error) {
      console.error('❌ Error in getAllTaskCategoriesThunk:', error);
      return 500;
    }
  };
};
