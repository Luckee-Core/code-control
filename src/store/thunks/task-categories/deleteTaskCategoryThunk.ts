import { AppThunk } from '@/store';
import { deleteTaskCategory } from '@/api/task-categories';
import { TaskCategoriesActions } from '@/store/dumps/taskCategories';

export const deleteTaskCategoryThunk = (id: string): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      console.log('🗑️ Deleting task category:', id);

      const response = await deleteTaskCategory(id);

      if (!response.success) {
        console.error('❌ Failed to delete task category:', response.error);
        return 500;
      }

      dispatch(TaskCategoriesActions.removeTaskCategory(id));
      console.log('✅ Task category deleted successfully');
      return 200;
    } catch (error) {
      console.error('❌ Error in deleteTaskCategoryThunk:', error);
      return 500;
    }
  };
};
