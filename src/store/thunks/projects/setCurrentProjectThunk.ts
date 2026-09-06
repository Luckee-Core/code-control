import { AppThunk } from '../../types';
import { CurrentProjectActions } from '../../current';
import type { Project } from '@/model/project';

type ResponseType = void;

/**
 * Sets the current customer project in Redux.
 * Call when the user opens a project workspace.
 */
export const setCurrentProjectThunk = (
  project: Project
): AppThunk<ResponseType> => {
  return (dispatch): ResponseType => {
    dispatch(CurrentProjectActions.setProject(project));
  };
};
