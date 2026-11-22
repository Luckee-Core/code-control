import { AppThunk } from '../../types';
import { SoftwareSystemsActions } from '../../dumps';
import { CurrentSoftwareSystemActions } from '../../current';
import { WorkspaceBuilderActions } from '../../builders';
import { updateSoftwareSystem } from '@/api/software-systems';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<{ status: 200 | 400 | 500; error?: string }>;

/**
 * Saves name, description and type from currentSoftwareSystem. On success the saved row becomes
 * current (the detail page stays on it) and the modal closes.
 */
export const updateSoftwareSystemThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const current = getState().currentSoftwareSystem;
      if (!current.id) return { status: 400, error: 'No software system is open' };
      const response = await updateSoftwareSystem(
        current.id,
        {
          name: current.name.trim(),
          description: current.description?.trim() || null,
          setup_preset_key: current.setup_preset_key ?? null,
        },
        getApiBaseUrl(),
      );
      if (!response.success || !response.data) {
        console.error('Failed to update software system:', response.error);
        return { status: 400, error: response.error ?? 'Failed to save' };
      }
      dispatch(SoftwareSystemsActions.updateSoftwareSystem(response.data));
      dispatch(CurrentSoftwareSystemActions.setSoftwareSystem(response.data));
      dispatch(WorkspaceBuilderActions.closeSoftwareSystemModal());
      return { status: 200 };
    } catch (error) {
      console.error('Error updating software system:', error);
      return { status: 500, error: error instanceof Error ? error.message : 'Failed to save' };
    }
  };
};
