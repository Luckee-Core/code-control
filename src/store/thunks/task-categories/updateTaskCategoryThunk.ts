import { AppThunk } from '@/store';
import { updateTaskCategory, UpdateTaskCategoryInput } from '@/api/task-categories';
import { TaskCategoriesActions } from '@/store/dumps/taskCategories';
import { TaskCategoryBuilderActions } from '@/store/builders/taskCategoryBuilder';
import { CurrentTaskCategoryActions } from '@/store/current/currentTaskCategory';

export const updateTaskCategoryThunk = (
  id: string,
  input: UpdateTaskCategoryInput
): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      console.log('📝 Updating task category:', id);
      dispatch(TaskCategoryBuilderActions.setIsLoading(true));

      const response = await updateTaskCategory(id, input);

      if (!response.success || !response.data) {
        console.error('❌ Failed to update task category:', response.error);
        dispatch(TaskCategoryBuilderActions.setIsLoading(false));
        return 500;
      }

      dispatch(TaskCategoriesActions.updateTaskCategory(response.data));
      dispatch(TaskCategoryBuilderActions.closeTaskCategoryModal());
      dispatch(CurrentTaskCategoryActions.clearCurrentTaskCategory(undefined));
      dispatch(TaskCategoryBuilderActions.setIsLoading(false));
      
      console.log('✅ Task category updated successfully');
      return 200;
    } catch (error) {
      console.error('❌ Error in updateTaskCategoryThunk:', error);
      dispatch(TaskCategoryBuilderActions.setIsLoading(false));
      return 500;
    }
  };
};
