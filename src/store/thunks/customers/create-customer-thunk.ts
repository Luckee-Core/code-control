import { AppThunk } from '../../types';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Customer creation lives in My Ops Tracker; not supported in Code Control.
 */
export const createCustomerThunk = (): AppThunk<ResponseType> => {
  return async (): ResponseType => {
    console.warn('Create customer in My Ops Tracker web app');
    return 400;
  };
};
