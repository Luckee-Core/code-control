import { AppThunk } from '../../types';
import { CustomersActions } from '../../dumps/customers';
import { getAllCustomers } from '@/api/customers';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

export const getAllCustomersThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await getAllCustomers(apiBaseUrl);
      if (!response.success || !response.data) {
        console.error('Failed to get customers:', response.error);
        return 500;
      }
      dispatch(CustomersActions.setCustomers(response.data));
      return 200;
    } catch (error) {
      console.error('Error getting customers:', error);
      return 500;
    }
  };
};
