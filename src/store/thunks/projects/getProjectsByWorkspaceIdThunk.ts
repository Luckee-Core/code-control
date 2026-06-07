import { AppThunk } from '../../types';
import { ProjectsActions } from '../../dumps';
import { getProjectsByWorkspaceId } from '@/api/projects';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

/**
 * Load projects for a workspace.
 */
export const getProjectsByWorkspaceIdThunk = (
  workspaceId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await getProjectsByWorkspaceId(workspaceId, apiBaseUrl);
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
