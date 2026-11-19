import { updateRepoRole } from '@/api/software-system-setup';
import type { AppThunk } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { getReposBySoftwareSystemIdThunk } from './get-repos-by-project-id-thunk';

/**
 * Tags a repo of the current software system with a role (or clears it), then reloads the
 * repos because the role moves off any repo that held it.
 */
export const updateRepoRoleThunk =
  (repoId: string, role: string | null): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const projectId = getState().currentSoftwareSystem.id;
    if (!projectId) return 400;
    const response = await updateRepoRole(projectId, repoId, role);
    if (!response.success) {
      dispatch(RepositoriesBuilderActions.setLinkError(response.error ?? 'Could not update the role'));
      return 500;
    }
    await dispatch(getReposBySoftwareSystemIdThunk());
    return 200;
  };
