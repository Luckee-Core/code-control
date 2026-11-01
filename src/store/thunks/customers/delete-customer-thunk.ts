import type { AppThunk } from '@/store/types';
import { deleteCustomer } from '@/api/crm/delete-customer';
import { CustomersActions } from '@/store/dumps/customers';

export type DeleteCustomerThunkResult = {
  status: 200 | 400 | 500;
  error?: string;
};

/**
 * Deletes a CRM customer and removes it from the local customers dump.
 */
export const deleteCustomerThunk = (customerId: string): AppThunk<Promise<DeleteCustomerThunkResult>> => {
  return async (dispatch): Promise<DeleteCustomerThunkResult> => {
    try {
      const response = await deleteCustomer(customerId);
      if (!response.success) {
        console.error('Failed to delete customer:', response.error);
        return { status: 400, error: response.error ?? 'Failed to delete customer' };
      }
      dispatch(CustomersActions.deleteCustomer(customerId));
      return { status: 200 };
    } catch (error) {
      console.error('Error deleting customer:', error);
      return {
        status: 500,
        error: error instanceof Error ? error.message : 'Failed to delete customer',
      };
    }
  };
};
