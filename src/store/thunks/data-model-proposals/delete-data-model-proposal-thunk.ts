import { deleteDataModelProposal } from '@/api/data-model-proposals';
import { DataModelBuilderActions } from '../../builders';
import { DataModelProposalsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Deletes the selected proposal version and selects the newest remaining one.
 */
export const deleteDataModelProposalThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const { selectedProposalId } = getState().dataModelBuilder;
    if (!selectedProposalId) return 400;

    dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'submitting' }));
    const response = await deleteDataModelProposal(selectedProposalId);
    if (!response.success) {
      dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not delete' }));
      return 500;
    }
    dispatch(DataModelProposalsActions.deleteDataModelProposal(selectedProposalId));
    const newest = Object.values(getState().dataModelProposals).sort((a, b) => b.version - a.version)[0];
    dispatch(DataModelBuilderActions.selectProposal(newest?.id ?? null));
    return 200;
  };
};
