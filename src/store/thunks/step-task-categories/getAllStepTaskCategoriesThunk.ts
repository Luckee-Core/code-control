import { AppThunk } from '@/store';
import { getAllStepTaskCategories } from '@/api/step-task-categories';
import { StepTaskCategoriesActions } from '@/store/dumps/stepTaskCategories';

export const getAllStepTaskCategoriesThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      console.log('🔍 Fetching all step task category mappings');
      const response = await getAllStepTaskCategories();

      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch step task categories:', response.error);
        return 500;
      }

      dispatch(StepTaskCategoriesActions.setStepTaskCategories(response.data));
      console.log(`✅ Loaded ${response.data.length} step task category mappings`);
      return 200;
    } catch (error) {
      console.error('❌ Error in getAllStepTaskCategoriesThunk:', error);
      return 500;
    }
  };
};
