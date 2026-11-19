import { deliverDataModel, type DeliveryRole } from '@/api/data-model-deliveries';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DataModelDeliveriesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Opens (or updates) the data-model PR for one role, or for every role when none is given.
 */
export const deliverDataModelThunk =
  (role?: DeliveryRole): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const proposalId = getState().dataModelBuilder.selectedProposalId;
    if (!proposalId) return 400;
    dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: role ?? 'all' }));
    const response = await deliverDataModel(proposalId, role ? [role] : undefined);
    if (!response.success || !response.data) {
      dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: '', error: response.error ?? 'Delivery failed' }));
      return 500;
    }
    dispatch(DataModelDeliveriesActions.mergeTargetsForProposal({ proposalId, targets: response.data }));
    dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: '' }));
    return 200;
  };
