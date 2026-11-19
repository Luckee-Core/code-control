import { listDataModelDeliveries } from '@/api/data-model-deliveries';
import type { DataModelDeliveryKind } from '@/model/data-model-delivery';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DataModelDeliveriesActions, deliveryTargetsKey } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads the delivery targets (storage, express, web) of one kind for an approved proposal.
 */
export const getDataModelDeliveriesThunk =
  (proposalId: string, kind: DataModelDeliveryKind): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    if (!proposalId) return 400;
    dispatch(DataModelDeliveryBuilderActions.setLoad({ status: 'loading' }));
    const response = await listDataModelDeliveries(proposalId, kind);
    if (!response.success || !response.data) {
      dispatch(DataModelDeliveryBuilderActions.setLoad({ status: 'error', error: response.error ?? 'Could not load deliveries' }));
      return 500;
    }
    dispatch(DataModelDeliveriesActions.setTargetsForProposal({ key: deliveryTargetsKey(proposalId, kind), targets: response.data }));
    dispatch(DataModelDeliveryBuilderActions.setLoad({ status: 'idle' }));
    return 200;
  };
