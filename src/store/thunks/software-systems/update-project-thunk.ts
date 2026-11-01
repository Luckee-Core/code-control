import { AppThunk } from '../../types';
import { SoftwareSystemsActions } from '../../dumps';
import { CurrentSoftwareSystemActions } from '../../current';
import { WorkspaceBuilderActions } from '../../builders';
import { updateSoftwareSystem } from '@/api/software-systems';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Updates the current project from currentSoftwareSystem.
 */
export const updateSoftwareSystemThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const current = getState().currentSoftwareSystem;
      if (!current.id) return 400;
      const apiBaseUrl = getApiBaseUrl();
      const response = await updateSoftwareSystem(
        current.id,
        {
          name: current.name.trim(),
          description: current.description?.trim() ?? null,
        },
        apiBaseUrl
      );
      if (!response.success) {
        console.error('Failed to update software system:', response.error);
        return 400;
      }
      if (!response.data) {
        return 400;
      }
      dispatch(SoftwareSystemsActions.updateSoftwareSystem(response.data));
      dispatch(CurrentSoftwareSystemActions.reset());
      dispatch(WorkspaceBuilderActions.closeSoftwareSystemModal());
      return 200;
    } catch (error) {
      console.error('Error updating customer project:', error);
      return 500;
    }
  };
};
