import { AppThunk } from '../../types';
import { WorkspaceBuilderActions } from '../../builders';

type ResponseType = void;

/**
 * Sets the active repo ID in the customer project builder.
 * Components derive the build profile from global state using this repo ID.
 */
export const setActiveRepoThunk = (
  repoId: string | null
): AppThunk<ResponseType> => {
  return (dispatch): ResponseType => {
    dispatch(WorkspaceBuilderActions.setActiveGuidedRepoId(repoId));
  };
};
