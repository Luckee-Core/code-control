import { AppThunk } from '../../types';
import { CurrentProjectActions } from '../../current';
import type { Project } from '@/model/project';

/**
 * Sets the current project before navigating to the project detail page.
 */
export const setCurrentProjectThunk = (project: Project): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    if (!project.id) {
      return 400;
    }
    dispatch(CurrentProjectActions.setProject(project));
    return 200;
  };
};
