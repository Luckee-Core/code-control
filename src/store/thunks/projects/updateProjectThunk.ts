import { AppThunk } from '../../types';
import { ProjectsActions } from '../../dumps';
import { CurrentProjectActions } from '../../current';
import { WorkspaceBuilderActions } from '../../builders';
import { updateProject } from '@/api/projects';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const updateProjectThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const current = getState().currentProject;
      if (!current.id) return 400;
      const apiBaseUrl = getApiBaseUrl();
      const response = await updateProject(
        current.id,
        {
          name: current.name.trim(),
          description: current.description?.trim() ?? null,
        },
        apiBaseUrl
      );
      if (!response.success || !response.data) {
        console.error('Failed to update customer project:', response.error);
        return 400;
      }
      dispatch(ProjectsActions.updateProject(response.data));
      dispatch(CurrentProjectActions.reset());
      dispatch(WorkspaceBuilderActions.closeProjectModal());
      return 200;
    } catch (error) {
      console.error('Error updating customer project:', error);
      return 500;
    }
  };
};
