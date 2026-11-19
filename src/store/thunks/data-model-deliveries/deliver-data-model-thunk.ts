import { deliverDataModel, type DeliveryRole } from '@/api/data-model-deliveries';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DataModelDeliveriesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Opens (or updates) the data-model PR for one role, or for every role that is not merged yet
 * when none is given. Squash-merges each PR when the builder's autoMerge is on.
 */
export const deliverDataModelThunk =
  (role?: DeliveryRole): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const proposalId = getState().dataModelBuilder.selectedProposalId;
    if (!proposalId) return 400;
    const state = getState();
    const targets = state.dataModelDeliveries[proposalId] ?? [];
    const roles: DeliveryRole[] = role
      ? [role]
      : targets.filter((target) => target.repo && target.delivery?.status !== 'merged').map((target) => target.role);
    if (roles.length === 0) return 200;
    dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: role ?? 'all' }));
    const response = await deliverDataModel(proposalId, roles, state.dataModelDeliveryBuilder.autoMerge);
    if (!response.success || !response.data) {
      dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: '', error: response.error ?? 'Delivery failed' }));
      return 500;
    }
    dispatch(DataModelDeliveriesActions.mergeTargetsForProposal({ proposalId, targets: response.data }));
    dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: '' }));
    return 200;
  };
