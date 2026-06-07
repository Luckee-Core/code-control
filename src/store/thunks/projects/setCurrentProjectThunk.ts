import { AppThunk } from '../../types';
import { CurrentProjectActions } from '../../current';
import type { Project } from '@/model/project';

type ResponseType = void;

/**
 * Sets the current customer project in Redux.
 * All data (repos, entities, build profiles, ARD queue) is already loaded via useCodeControlDataLoader.
 * Call when user selects a project.
 */
export const setCurrentProjectThunk = (
  project: Project
): AppThunk<ResponseType> => {
  return (dispatch): ResponseType => {
    dispatch(CurrentProjectActions.setProject(project));
  };
};
