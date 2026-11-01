import { AppThunk } from '../../types';
import { SoftwareSystemsActions } from '../../dumps';
import { CurrentSoftwareSystemActions } from '../../current';
import { WorkspaceBuilderActions } from '../../builders';
import { createSoftwareSystem } from '@/api/software-systems';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Creates a project from currentSoftwareSystem.
 */
export const createSoftwareSystemThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const current = getState().currentSoftwareSystem;
      const apiBaseUrl = getApiBaseUrl();
      const response = await createSoftwareSystem(
        {
          customer_id: current.customer_id,
          name: current.name.trim(),
          description: current.description?.trim() ?? null,
        },
        apiBaseUrl
      );
      if (!response.success || !response.data) {
        console.error('Failed to create software system:', response.success ? 'No data' : response.error);
        return 400;
      }
      dispatch(SoftwareSystemsActions.addSoftwareSystem(response.data));
      dispatch(CurrentSoftwareSystemActions.setSoftwareSystem(response.data));
      dispatch(WorkspaceBuilderActions.closeSoftwareSystemModal());
      return 200;
    } catch (error) {
      console.error('Error creating customer project:', error);
      return 500;
    }
  };
};
