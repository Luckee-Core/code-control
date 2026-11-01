import { AppThunk } from '../../types';
import { SoftwareSystemsActions } from '../../dumps';
import { getAllSoftwareSystems } from '@/api/software-systems';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

/**
 * Loads every project into the dump.
 */
export const getAllSoftwareSystemsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await getAllSoftwareSystems(apiBaseUrl);
      if (!response.success) {
        console.error('Failed to fetch all software systems:', response.error);
        return 500;
      }
      dispatch(SoftwareSystemsActions.setSoftwareSystems(response.data ?? []));
      return 200;
    } catch (error) {
      console.error('Error fetching all customer projects:', error);
      return 500;
    }
  };
};
