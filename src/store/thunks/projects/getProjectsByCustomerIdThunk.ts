import { AppThunk } from '../../types';
import { ProjectsActions } from '../../dumps';
import { getProjectsByCustomerId } from '@/api/projects';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

/**
 * Load projects for a customer.
 */
export const getProjectsByCustomerIdThunk = (
  customerId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await getProjectsByCustomerId(customerId, apiBaseUrl);
      if (!response.success || !response.data) {
        console.error('❌ Failed to fetch projects:', response.error);
        return 500;
      }
      dispatch(ProjectsActions.setProjects(response.data));
      return 200;
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      return 500;
    }
  };
};
