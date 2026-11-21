import { deliverDataModel, type DeliveryRole } from '@/api/data-model-deliveries';
import type { DataModelDeliveryKind } from '@/model/data-model-delivery';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DataModelDeliveriesActions, deliveryTargetsKey } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Opens (or updates) the PR of one kind for one role, or for every role that is not merged yet
 * when none is given (layout: every role, since a merged layout is delivered again when the repo
 * gained tables or pages; express skips it when nothing would change). Squash-merges each PR when the builder's autoMerge is on.
 */
export const deliverDataModelThunk =
  (proposalId: string, kind: DataModelDeliveryKind, role?: DeliveryRole): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    if (!proposalId) return 400;
    const state = getState();
    const key = deliveryTargetsKey(proposalId, kind);
    const targets = state.dataModelDeliveries[key] ?? [];
    const roles: DeliveryRole[] = role
      ? [role]
      : targets
          .filter((target) => target.repo && (kind === 'layout' || kind === 'list' || kind === 'detail' || target.delivery?.status !== 'merged'))
          .map((target) => target.role);
    if (roles.length === 0) return 200;
    dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: role ?? 'all' }));
    const response = await deliverDataModel(proposalId, kind, roles, state.dataModelDeliveryBuilder.autoMerge);
    if (!response.success || !response.data) {
      dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: '', error: response.error ?? 'Delivery failed' }));
      return 500;
    }
    dispatch(DataModelDeliveriesActions.mergeTargetsForProposal({ key, targets: response.data }));
    dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: '' }));
    return 200;
  };
