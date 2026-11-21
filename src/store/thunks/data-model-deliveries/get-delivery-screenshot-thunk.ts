import { screenshotDataModelDelivery, type DeliveryRole } from '@/api/data-model-deliveries';
import type { DataModelDeliveryKind } from '@/model/data-model-delivery';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DataModelDeliveryScreenshotsActions, deliveryPreviewKey } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Screenshots the template's preview page for one role, rendered against the repo's current
 * default branch (what a delivery would produce today).
 */
export const getDeliveryScreenshotThunk =
  (proposalId: string, kind: DataModelDeliveryKind, role: DeliveryRole): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    if (!proposalId) return 400;
    dispatch(DataModelDeliveryBuilderActions.setScreenshotStatus({ status: 'loading' }));
    const response = await screenshotDataModelDelivery(proposalId, kind, role);
    if (!response.success || !response.data) {
      dispatch(DataModelDeliveryBuilderActions.setScreenshotStatus({ status: 'error', error: response.error ?? 'Screenshot failed' }));
      return 500;
    }
    dispatch(DataModelDeliveryScreenshotsActions.setScreenshot({ key: deliveryPreviewKey(proposalId, kind, role), screenshot: response.data }));
    dispatch(DataModelDeliveryBuilderActions.setScreenshotStatus({ status: 'idle' }));
    return 200;
  };
