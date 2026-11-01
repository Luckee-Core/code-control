import { AppThunk } from '../../types';
import { CustomersActions } from '../../dumps/customers';
import { listCustomers } from '@/api/crm';

type ResponseType = Promise<200 | 500>;

/**
 * Loads every customer from Ops CRM into the dump.
 */
export const getAllCustomersThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await listCustomers();
      if (!response.success) {
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
