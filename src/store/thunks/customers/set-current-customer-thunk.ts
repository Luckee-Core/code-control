import { AppThunk } from '../../types';
import { CurrentCustomerActions } from '../../current';
import { CustomersActions } from '../../dumps/customers';
import { getCustomerById } from '@/api/customers';
import { getApiBaseUrl } from '@/api/config';
import type { Customer } from '@/model/customer';

type ResponseType = Promise<200 | 404 | 500>;

/**
 * Sets the current customer before navigating to the customer detail page.
 */
export const setCurrentCustomerThunk = (
  customerOrId: Customer | string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      let customer: Customer;

      if (typeof customerOrId === 'object') {
        customer = customerOrId;
      } else {
        const apiBaseUrl = getApiBaseUrl();
        const response = await getCustomerById(customerOrId, apiBaseUrl);

        if (!response.success || !response.data) {
          console.error('Failed to fetch customer:', response.error);
          return 404;
        }

        customer = response.data;
        dispatch(CustomersActions.updateCustomer(customer));
      }

      dispatch(CurrentCustomerActions.setCustomer(customer));
      return 200;
    } catch (error) {
      console.error('Error setting current customer:', error);
      return 500;
    }
  };
};
