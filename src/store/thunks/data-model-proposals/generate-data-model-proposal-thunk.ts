import { createDataModelProposal } from '@/api/data-model-proposals';
import { DataModelBuilderActions } from '../../builders';
import { DataModelProposalsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Starts a new proposal version from the context box (reads currentSoftwareSystem + builder).
 */
export const generateDataModelProposalThunk = (): AppThunk<Promise<202 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const softwareSystemId = getState().currentSoftwareSystem.id;
    const contextText = getState().dataModelBuilder.contextDraft.trim();
    if (!softwareSystemId || !contextText) {
      dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'error', error: 'Describe the product first' }));
      return 400;
    }

    dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'submitting' }));
    const response = await createDataModelProposal(softwareSystemId, contextText);
    if (!response.success || !response.data) {
      dispatch(DataModelBuilderActions.setSubmitStatus({ status: 'error', error: response.error ?? 'Could not start' }));
      return 500;
    }
    dispatch(DataModelProposalsActions.upsertDataModelProposal(response.data));
    dispatch(DataModelBuilderActions.selectProposal(response.data.id));
    return 202;
  };
};
