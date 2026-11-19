import { refreshDataModelDelivery } from '@/api/data-model-deliveries';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DataModelDeliveriesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Re-reads one delivery's PR state (open / merged / closed) from GitHub.
 */
export const refreshDataModelDeliveryThunk =
  (deliveryId: string): AppThunk<Promise<200 | 500>> =>
  async (dispatch) => {
    const response = await refreshDataModelDelivery(deliveryId);
    if (!response.success || !response.data) {
      dispatch(DataModelDeliveryBuilderActions.setDelivering({ role: '', error: response.error ?? 'Refresh failed' }));
      return 500;
    }
    dispatch(DataModelDeliveriesActions.upsertDelivery(response.data));
    return 200;
  };
