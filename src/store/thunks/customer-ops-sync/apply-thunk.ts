import type { AppThunk } from '@/store/types';
import { applyCustomerOpsSync } from '@/api/customer-ops-sync';
import { CustomerOpsSyncBuilderActions } from '@/store/builders/customerOpsSyncBuilder';
import { getAllCustomersThunk } from '@/store/thunks/customers/get-all-customers-thunk';
import { getAllSoftwareSystemsThunk } from '@/store/thunks/software-systems/get-all-projects-thunk';

/** Applies draft decisions and refreshes customer/project dumps. */
export const applyCustomerOpsSyncThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const { comparePayload, draftDecisions } = getState().customerOpsSyncBuilder;
  if (!comparePayload) {
    dispatch(CustomerOpsSyncBuilderActions.setApplyError('Nothing to apply'));
    return 400;
  }

  const decisions = comparePayload.localCustomers.map((local) => {
    const draft = draftDecisions[local.id] ?? { action: 'create' as const };
    return {
      localCustomerId: local.id,
      action: draft.action,
      opsCustomerId: draft.action === 'link' ? draft.opsCustomerId : undefined,
    };
  });

  dispatch(CustomerOpsSyncBuilderActions.setApplyLoading(true));
  dispatch(CustomerOpsSyncBuilderActions.setApplyError(null));
  const result = await applyCustomerOpsSync(decisions);
  dispatch(CustomerOpsSyncBuilderActions.setApplyLoading(false));

  if (!result.success) {
    const rowErrors =
      result.data?.results
        .filter((row) => row.status === 'error' && row.error)
        .map((row) => {
          const name =
            comparePayload.localCustomers.find((c) => c.id === row.localCustomerId)?.name ??
            row.localCustomerId.slice(0, 8);
          return `${name}: ${row.error}`;
        }) ?? [];
    const message =
      rowErrors.length > 0 ? rowErrors.join(' · ') : result.error;
    dispatch(CustomerOpsSyncBuilderActions.setApplyError(message));
    return result.httpStatus >= 500 ? 500 : 400;
  }

  await dispatch(getAllCustomersThunk());
  await dispatch(getAllSoftwareSystemsThunk());
  dispatch(CustomerOpsSyncBuilderActions.closeModal());
  return 200;
};
