import { DataModelBuilderActions } from '../../builders';
import type { AppThunk } from '../../types';
import { refreshDataModelProposalThunk } from './refresh-data-model-proposal-thunk';

/**
 * Selects a proposal version and loads its AI call summaries.
 */
export const selectDataModelProposalThunk = (proposalId: string): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    dispatch(DataModelBuilderActions.selectProposal(proposalId));
    await dispatch(refreshDataModelProposalThunk(proposalId));
  };
};
