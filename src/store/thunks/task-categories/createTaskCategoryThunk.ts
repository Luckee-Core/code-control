import { AppThunk } from '@/store';
import { createTaskCategory, CreateTaskCategoryInput } from '@/api/task-categories';
import { TaskCategoriesActions } from '@/store/dumps/taskCategories';
import { TaskCategoryBuilderActions } from '@/store/builders/taskCategoryBuilder';
import { CurrentTaskCategoryActions } from '@/store/current/currentTaskCategory';

export const createTaskCategoryThunk = (
  input: CreateTaskCategoryInput
): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      console.log('📝 Creating task category:', input.name);
      dispatch(TaskCategoryBuilderActions.setIsLoading(true));

      const response = await createTaskCategory(input);

      if (!response.success || !response.data) {
        console.error('❌ Failed to create task category:', response.error);
        dispatch(TaskCategoryBuilderActions.setIsLoading(false));
        return 500;
      }

      dispatch(TaskCategoriesActions.addTaskCategory(response.data));
      dispatch(TaskCategoryBuilderActions.closeTaskCategoryModal());
      dispatch(CurrentTaskCategoryActions.clearCurrentTaskCategory(undefined));
      dispatch(TaskCategoryBuilderActions.setIsLoading(false));
      
      console.log('✅ Task category created successfully');
      return 200;
    } catch (error) {
      console.error('❌ Error in createTaskCategoryThunk:', error);
      dispatch(TaskCategoryBuilderActions.setIsLoading(false));
      return 500;
    }
  };
};
