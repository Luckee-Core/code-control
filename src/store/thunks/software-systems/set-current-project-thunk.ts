import { AppThunk } from '../../types';
import { CurrentSoftwareSystemActions } from '../../current';
import type { SoftwareSystem } from '@/model/software-system';

/**
 * Sets the current project before navigating to the project detail page.
 */
export const setCurrentSoftwareSystemThunk = (project: SoftwareSystem): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch): Promise<200 | 400 | 500> => {
    if (!project.id) {
      return 400;
    }
    dispatch(CurrentSoftwareSystemActions.setSoftwareSystem(project));
    return 200;
  };
};
