import { AppThunk } from '../../types';
import { ProjectsActions } from '../../dumps';
import { getAllProjects } from '@/api/projects';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

export const getAllProjectsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await getAllProjects(apiBaseUrl);
      if (!response.success || !response.data) {
        console.error('Failed to fetch all customer projects:', response.error);
        return 500;
      }
      dispatch(ProjectsActions.setProjects(response.data));
      return 200;
    } catch (error) {
      console.error('Error fetching all customer projects:', error);
      return 500;
    }
  };
};
