import { AppThunk } from '../../types';
import { SoftwareSystemsActions } from '../../dumps';
import { WorkspaceBuilderActions } from '../../builders';

/**
 * Opens the software system modal in edit mode for the current system. The saved row is kept in
 * the dump so Cancel can put the unsaved edits back.
 */
export const openEditSoftwareSystemThunk = (): AppThunk<void> => {
  return (dispatch, getState) => {
    const current = getState().currentSoftwareSystem;
    if (!current.id) return;
    if (!getState().softwareSystems[current.id]) dispatch(SoftwareSystemsActions.addSoftwareSystem(current));
    dispatch(WorkspaceBuilderActions.openSoftwareSystemModal(current.id));
  };
};
