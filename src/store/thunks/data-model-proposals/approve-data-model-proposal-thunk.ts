import { approveDataModelProposal } from '@/api/data-model-proposals';
import { DataModelBuilderActions } from '../../builders';
import type { AppThunk } from '../../types';
import { getDataModelProposalsThunk } from './get-data-model-proposals-thunk';

/**
 * Approves the selected proposal, then reloads the list (older approvals become superseded).
 */
export const approveDataModelProposalThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const { selectedProposalId } = getState().dataModelBuilder;
    if (!selectedProposalId) return 400;

    dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'submitting' }));
    const response = await approveDataModelProposal(selectedProposalId);
    if (!response.success) {
      dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not approve' }));
      return 500;
    }
    dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'idle' }));
    await dispatch(getDataModelProposalsThunk());
    return 200;
  };
};
