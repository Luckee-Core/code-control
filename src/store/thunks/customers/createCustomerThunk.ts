import { AppThunk } from '../../types';
import { CustomersActions } from '../../dumps';
import { CurrentCustomerActions } from '../../current';
import { CustomerBuilderActions } from '../../builders';
import { createCustomer } from '@/api/customers';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Creates a customer from currentCustomer form state and closes the modal.
 */
export const createCustomerThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const current = getState().currentCustomer;
      const name = current.name.trim();
      if (!name) {
        return 400;
      }
      const apiBaseUrl = getApiBaseUrl();
      const response = await createCustomer({ name }, apiBaseUrl);
      if (!response.success || !response.data) {
        console.error('❌ Failed to create customer:', response.error);
        return 400;
      }
      dispatch(CustomersActions.addCustomer(response.data));
      dispatch(CustomerBuilderActions.closeCustomerModal());
      dispatch(CurrentCustomerActions.reset());
      console.log('✅ Customer created:', response.data.id);
      return 200;
    } catch (error) {
      console.error('❌ Error creating customer:', error);
      return 500;
    }
  };
};
