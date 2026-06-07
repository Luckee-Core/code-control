import { AppThunk } from '@/store';
import { updateBuildStep, UpdateBuildStepInput } from '@/api/build-steps';
import { BuildStepsActions } from '@/store/dumps/buildSteps';
import { BuildStepBuilderActions } from '@/store/builders/buildStepBuilder';
import { CurrentBuildStepActions } from '@/store/current/currentBuildStep';

export const updateBuildStepThunk = (
  id: string,
  input: UpdateBuildStepInput
): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      console.log('📝 Updating build step:', id);
      dispatch(BuildStepBuilderActions.setIsLoading(true));

      const response = await updateBuildStep(id, input);

      if (!response.success || !response.data) {
        console.error('❌ Failed to update build step:', response.error);
        dispatch(BuildStepBuilderActions.setIsLoading(false));
        return 500;
      }

      dispatch(BuildStepsActions.updateBuildStep(response.data));
      dispatch(BuildStepBuilderActions.closeBuildStepModal());
      dispatch(CurrentBuildStepActions.clearCurrentBuildStep(undefined));
      dispatch(BuildStepBuilderActions.setIsLoading(false));
      
      console.log('✅ Build step updated successfully');
      return 200;
    } catch (error) {
      console.error('❌ Error in updateBuildStepThunk:', error);
      dispatch(BuildStepBuilderActions.setIsLoading(false));
      return 500;
    }
  };
};
