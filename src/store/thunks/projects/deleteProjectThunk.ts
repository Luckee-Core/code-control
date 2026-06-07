import { AppThunk } from '../../types';
import { ProjectsActions } from '../../dumps';
import { WorkspaceBuilderActions } from '../../builders';
import { deleteProject } from '@/api/projects';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteProjectThunk = (projectId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await deleteProject(projectId, apiBaseUrl);
      if (!response.success) {
        console.error('Failed to delete customer project:', response.error);
        return 400;
      }
      dispatch(ProjectsActions.deleteProject(projectId));
      dispatch(WorkspaceBuilderActions.setActiveProjectId(null));
      return 200;
    } catch (error) {
      console.error('Error deleting customer project:', error);
      return 500;
    }
  };
};
