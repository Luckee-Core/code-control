import { AppThunk } from '@/store';
import { getAllBuildSteps } from '@/api/build-steps';
import { BuildStepsActions } from '@/store/dumps/buildSteps';

export const getAllBuildStepsThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      console.log('🔍 Fetching all build steps');
      const response = await getAllBuildSteps();

      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch build steps:', response.error);
        return 500;
      }

      dispatch(BuildStepsActions.setBuildSteps(response.data));
      console.log(`✅ Loaded ${response.data.length} build steps`);
      return 200;
    } catch (error) {
      console.error('❌ Error in getAllBuildStepsThunk:', error);
      return 500;
    }
  };
};
