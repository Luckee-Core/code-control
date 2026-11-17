import { reviseDataModelProposal } from '@/api/data-model-proposals';
import { DataModelBuilderActions } from '../../builders';
import { DataModelProposalsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Starts the next version from the selected proposal plus the feedback box.
 */
export const reviseDataModelProposalThunk = (): AppThunk<Promise<202 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const { selectedProposalId, feedbackDraft } = getState().dataModelBuilder;
    const feedback = feedbackDraft.trim();
    if (!selectedProposalId || !feedback) {
      dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'error', error: 'Write what should change' }));
      return 400;
    }

    dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'submitting' }));
    const response = await reviseDataModelProposal(selectedProposalId, feedback);
    if (!response.success || !response.data) {
      dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not revise' }));
      return 500;
    }
    dispatch(DataModelProposalsActions.upsertDataModelProposal(response.data));
    dispatch(DataModelBuilderActions.selectProposal(response.data.id));
    return 202;
  };
};
