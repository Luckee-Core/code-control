import { AppThunk } from '../../types';
import { SoftwareSystemsActions } from '../../dumps';
import { getSoftwareSystemsByCustomerId } from '@/api/software-systems';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

/**
 * Merges projects for one customer into the dump.
 */
export const getSoftwareSystemsByCustomerIdThunk = (
  customerId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await getSoftwareSystemsByCustomerId(customerId, apiBaseUrl);
      if (!response.success) {
        console.error('❌ Failed to fetch software systems:', response.error);
        return 500;
      }
      (response.data ?? []).forEach((system) => {
        dispatch(SoftwareSystemsActions.addSoftwareSystem(system));
      });
      return 200;
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      return 500;
    }
  };
};
