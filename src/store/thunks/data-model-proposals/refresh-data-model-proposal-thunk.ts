import { getDataModelProposal } from '@/api/data-model-proposals';
import { DataModelProposalExchangesActions, DataModelProposalsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Re-fetches one proposal and its AI call summaries (used for polling while it runs).
 */
export const refreshDataModelProposalThunk = (proposalId: string): AppThunk<Promise<200 | 404 | 500>> => {
  return async (dispatch) => {
    const response = await getDataModelProposal(proposalId);
    if (!response.success || !response.data) {
      console.error('❌ Failed to refresh data model proposal:', response.error);
      return response.error === 'Proposal not found' ? 404 : 500;
    }
    dispatch(DataModelProposalsActions.upsertDataModelProposal(response.data.proposal));
    dispatch(
      DataModelProposalExchangesActions.setExchangesForProposal({
        proposalId,
        exchanges: response.data.exchanges,
      }),
    );
    return 200;
  };
};
