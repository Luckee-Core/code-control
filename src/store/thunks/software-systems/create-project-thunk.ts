import { AppThunk } from '../../types';
import { SoftwareSystemsActions } from '../../dumps';
import { CurrentSoftwareSystemActions } from '../../current';
import { WorkspaceBuilderActions } from '../../builders';
import { createSoftwareSystem } from '@/api/software-systems';
import { getApiBaseUrl } from '@/api/config';
import { applySetupPresetThunk } from '../software-system-repos/apply-setup-preset-thunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Creates a project from currentSoftwareSystem, then starts creating its type's repos.
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
          setup_preset_key: current.setup_preset_key ?? 'none',
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
      // A project type with roles creates its repos in the background; the Repositories tab shows progress.
      const preset = getState().setupPresets[response.data.setup_preset_key ?? 'none'];
      if (preset && preset.role_keys.length > 0) {
        void dispatch(applySetupPresetThunk());
      }
      return 200;
    } catch (error) {
      console.error('Error creating customer project:', error);
      return 500;
    }
  };
};
