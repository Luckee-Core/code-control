import { AppThunk } from '@/store';
import { getAllConventionTaskCategories } from '@/api/convention-task-categories';
import { ConventionTaskCategoriesActions } from '@/store/dumps/conventionTaskCategories';

export const getAllConventionTaskCategoriesThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      console.log('🔍 Fetching all convention task category mappings');
      const response = await getAllConventionTaskCategories();

      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch convention task categories:', response.error);
        return 500;
      }

      dispatch(ConventionTaskCategoriesActions.setConventionTaskCategories(response.data));
      console.log(`✅ Loaded ${response.data.length} convention task category mappings`);
      return 200;
    } catch (error) {
      console.error('❌ Error in getAllConventionTaskCategoriesThunk:', error);
      return 500;
    }
  };
};
