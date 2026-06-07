import { AppThunk } from '../../types';
import { ProjectsActions } from '../../dumps';
import { CurrentProjectActions } from '../../current';
import { WorkspaceBuilderActions } from '../../builders';
import { createProject } from '@/api/projects';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const createProjectThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const current = getState().currentProject;
      const apiBaseUrl = getApiBaseUrl();
      const response = await createProject(
        {
          customer_id: current.customer_id,
          name: current.name.trim(),
          description: current.description?.trim() ?? null,
          app_type: current.app_type && current.app_type !== 'custom' ? current.app_type : undefined,
        },
        apiBaseUrl
      );
      if (!response.success || !response.data) {
        console.error('Failed to create customer project:', response.error);
        return 400;
      }
      dispatch(ProjectsActions.addProject(response.data));
      dispatch(CurrentProjectActions.reset());
      dispatch(WorkspaceBuilderActions.closeProjectModal());
      return 200;
    } catch (error) {
      console.error('Error creating customer project:', error);
      return 500;
    }
  };
};
