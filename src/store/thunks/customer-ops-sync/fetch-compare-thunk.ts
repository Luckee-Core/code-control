import type { AppThunk } from '@/store/types';
import { fetchCustomerOpsSyncCompare, type CustomerOpsSyncComparePayload } from '@/api/customer-ops-sync';
import type { CustomerOpsSyncDraftDecision } from '@/store/builders/customerOpsSyncBuilder';
import { CustomerOpsSyncBuilderActions } from '@/store/builders/customerOpsSyncBuilder';

const buildInitialDrafts = (
  payload: CustomerOpsSyncComparePayload,
): Record<string, CustomerOpsSyncDraftDecision> => {
  const drafts: Record<string, CustomerOpsSyncDraftDecision> = {};
  for (const local of payload.localCustomers) {
    const suggestion = payload.suggestions.find((s) => s.localCustomerId === local.id);
    if (suggestion?.suggestedOpsCustomerId && suggestion.matchKind === 'exact_name') {
      drafts[local.id] = { action: 'link', opsCustomerId: suggestion.suggestedOpsCustomerId };
    } else if (suggestion?.suggestedOpsCustomerId) {
      drafts[local.id] = { action: 'link', opsCustomerId: suggestion.suggestedOpsCustomerId };
    } else {
      drafts[local.id] = { action: 'create' };
    }
  }
  return drafts;
};

/** Opens modal and loads compare payload from express. */
export const fetchCustomerOpsSyncCompareThunk =
  (): AppThunk<Promise<200 | 400 | 500 | 503>> => async (dispatch) => {
    dispatch(CustomerOpsSyncBuilderActions.openModal());
    dispatch(CustomerOpsSyncBuilderActions.setCompareLoading(true));
    dispatch(CustomerOpsSyncBuilderActions.setCompareError(null));
    const result = await fetchCustomerOpsSyncCompare();
    dispatch(CustomerOpsSyncBuilderActions.setCompareLoading(false));
    if (!result.success) {
      dispatch(CustomerOpsSyncBuilderActions.setCompareError(result.error));
      if (result.httpStatus === 503) return 503;
      return result.httpStatus >= 500 ? 500 : 400;
    }
    dispatch(CustomerOpsSyncBuilderActions.setComparePayload(result.data));
    dispatch(CustomerOpsSyncBuilderActions.setDraftDecisions(buildInitialDrafts(result.data)));
    return 200;
  };
