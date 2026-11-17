import { listDataModelProposals } from '@/api/data-model-proposals';
import { DataModelBuilderActions } from '../../builders';
import { DataModelProposalsActions } from '../../dumps';
import type { AppThunk } from '../../types';
import { refreshDataModelProposalThunk } from './refresh-data-model-proposal-thunk';

/**
 * Loads the current software system's proposals. Keeps the selection when it still exists,
 * otherwise selects the newest version, and pre-fills the context box from it once.
 */
export const getDataModelProposalsThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const softwareSystemId = getState().currentSoftwareSystem.id;
    if (!softwareSystemId) return 400;

    dispatch(DataModelBuilderActions.startForSoftwareSystem(softwareSystemId));
    dispatch(DataModelBuilderActions.setLoading({ isLoading: true }));
    const response = await listDataModelProposals(softwareSystemId);
    if (!response.success || !response.data) {
      dispatch(DataModelBuilderActions.setLoading({ isLoading: false, error: response.error ?? 'Could not load proposals' }));
      return 500;
    }

    const proposals = response.data;
    dispatch(DataModelProposalsActions.setDataModelProposals(proposals));
    dispatch(DataModelBuilderActions.setLoading({ isLoading: false }));

    const builder = getState().dataModelBuilder;
    const selected = proposals.find((proposal) => proposal.id === builder.selectedProposalId) ?? proposals[0] ?? null;
    if (selected?.id !== builder.selectedProposalId) {
      dispatch(DataModelBuilderActions.selectProposal(selected?.id ?? null));
    }
    if (selected && !builder.contextDraft.trim()) {
      dispatch(DataModelBuilderActions.setContextDraft(selected.context_text));
    }
    if (selected) {
      void dispatch(refreshDataModelProposalThunk(selected.id));
    }
    return 200;
  };
};
