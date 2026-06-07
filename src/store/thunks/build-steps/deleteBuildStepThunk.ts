import { AppThunk } from '@/store';
import { deleteBuildStep } from '@/api/build-steps';
import { BuildStepsActions } from '@/store/dumps/buildSteps';

export const deleteBuildStepThunk = (id: string): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      console.log('🗑️ Deleting build step:', id);

      const response = await deleteBuildStep(id);

      if (!response.success) {
        console.error('❌ Failed to delete build step:', response.error);
        return 500;
      }

      dispatch(BuildStepsActions.removeBuildStep(id));
      console.log('✅ Build step deleted successfully');
      return 200;
    } catch (error) {
      console.error('❌ Error in deleteBuildStepThunk:', error);
      return 500;
    }
  };
};
