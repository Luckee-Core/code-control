import { AppThunk } from '@/store';
import { createBuildStep, CreateBuildStepInput } from '@/api/build-steps';
import { BuildStepsActions } from '@/store/dumps/buildSteps';
import { BuildStepBuilderActions } from '@/store/builders/buildStepBuilder';
import { CurrentBuildStepActions } from '@/store/current/currentBuildStep';

export const createBuildStepThunk = (
  input: CreateBuildStepInput
): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    try {
      console.log('📝 Creating build step:', input.name);
      dispatch(BuildStepBuilderActions.setIsLoading(true));

      const response = await createBuildStep(input);

      if (!response.success || !response.data) {
        console.error('❌ Failed to create build step:', response.error);
        dispatch(BuildStepBuilderActions.setIsLoading(false));
        return 500;
      }

      dispatch(BuildStepsActions.addBuildStep(response.data));
      dispatch(BuildStepBuilderActions.closeBuildStepModal());
      dispatch(CurrentBuildStepActions.clearCurrentBuildStep(undefined));
      dispatch(BuildStepBuilderActions.setIsLoading(false));
      
      console.log('✅ Build step created successfully');
      return 200;
    } catch (error) {
      console.error('❌ Error in createBuildStepThunk:', error);
      dispatch(BuildStepBuilderActions.setIsLoading(false));
      return 500;
    }
  };
};
