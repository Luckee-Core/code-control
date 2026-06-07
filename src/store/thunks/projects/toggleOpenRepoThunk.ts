import { AppThunk } from '../../types';
import { WorkspaceBuilderActions } from '../../builders';

type ResponseType = void;

/**
 * Toggles a repo in the openReposInWorkspace list.
 * Multiple repos can be expanded at once in the guided pathway sidebar.
 */
export const toggleOpenRepoThunk = (repoId: string): AppThunk<ResponseType> => {
  return (dispatch): ResponseType => {
    dispatch(WorkspaceBuilderActions.toggleOpenRepo(repoId));
  };
};
