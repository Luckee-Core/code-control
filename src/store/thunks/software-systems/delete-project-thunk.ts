import { AppThunk } from '../../types';
import { SoftwareSystemsActions } from '../../dumps';
import { deleteSoftwareSystem } from '@/api/software-systems';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Deletes a software system by id.
 */
export const deleteSoftwareSystemThunk = (softwareSystemId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await deleteSoftwareSystem(softwareSystemId, apiBaseUrl);
      if (!response.success) {
        console.error('Failed to delete software system:', response.error);
        return 400;
      }
      dispatch(SoftwareSystemsActions.deleteSoftwareSystem(softwareSystemId));
      return 200;
    } catch (error) {
      console.error('Error deleting software system:', error);
      return 500;
    }
  };
};
