import { AppThunk } from '../../types';
import { BuildExamplesActions } from '../../dumps';
import { getAllBuildExamples } from '@/api/build-examples';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

export const getAllBuildExamplesThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await getAllBuildExamples(apiBaseUrl);
      if (!response.success || !response.data) {
        console.error('Failed to fetch build examples:', response.error);
        return 500;
      }
      dispatch(BuildExamplesActions.setBuildExamples(response.data));
      return 200;
    } catch (error) {
      console.error('Error fetching build examples:', error);
      return 500;
    }
  };
};
