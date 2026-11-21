import { mergeDataModelDelivery } from '@/api/data-model-deliveries';
import type { DeliveryRole } from '@/api/data-model-deliveries';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DataModelDeliveriesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** deliveringRole while a row's PR is being merged (the row shows Merging…). */
export const mergingRoleKey = (role: DeliveryRole): string => `merge:${role}`;

/**
 * Squash-merges one delivery's open PR on GitHub and stores the merged delivery.
 */
export const mergeDataModelDeliveryThunk =
  (deliveryId: string, role: DeliveryRole): AppThunk<Promise<200 | 500>> =>
  async (dispatch) => {
    dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: mergingRoleKey(role) }));
    const response = await mergeDataModelDelivery(deliveryId);
    if (!response.success || !response.data) {
      dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: '', error: response.error ?? 'Merge failed' }));
      return 500;
    }
    dispatch(DataModelDeliveriesActions.upsertDelivery(response.data));
    dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: '' }));
    return 200;
  };
