import { listDataModelDeliveries } from '@/api/data-model-deliveries';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DataModelDeliveriesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads the delivery targets (storage, express, web) for the selected, approved proposal.
 */
export const getDataModelDeliveriesThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const proposalId = getState().dataModelBuilder.selectedProposalId;
  if (!proposalId) return 400;
  dispatch(DataModelDeliveryBuilderActions.setLoad({ status: 'loading' }));
  const response = await listDataModelDeliveries(proposalId);
  if (!response.success || !response.data) {
    dispatch(DataModelDeliveryBuilderActions.setLoad({ status: 'error', error: response.error ?? 'Could not load deliveries' }));
    return 500;
  }
  dispatch(DataModelDeliveriesActions.setTargetsForProposal({ proposalId, targets: response.data }));
  dispatch(DataModelDeliveryBuilderActions.setLoad({ status: 'idle' }));
  return 200;
};
