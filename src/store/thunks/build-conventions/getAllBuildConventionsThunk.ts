import { AppThunk } from '../../types';
import { BuildConventionsActions } from '../../dumps';
import { getAllBuildConventions } from '@/api/build-conventions';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

export const getAllBuildConventionsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await getAllBuildConventions(apiBaseUrl);
      if (!response.success || !response.data) {
        console.error('Failed to fetch build conventions:', response.error);
        return 500;
      }
      dispatch(BuildConventionsActions.setBuildConventions(response.data));
      return 200;
    } catch (error) {
      console.error('Error fetching build conventions:', error);
      return 500;
    }
  };
};
