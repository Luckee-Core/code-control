import { previewDataModelDelivery, type DeliveryRole } from '@/api/data-model-deliveries';
import type { DataModelDeliveryKind } from '@/model/data-model-delivery';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DataModelDeliveryPreviewsActions, deliveryPreviewKey } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Renders the files a delivery of `kind` would write for one role (against the repo's default
 * branch) and opens the preview on the first file.
 */
export const openDeliveryPreviewThunk =
  (proposalId: string, kind: DataModelDeliveryKind, role: DeliveryRole): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    if (!proposalId) return 400;
    dispatch(DataModelDeliveryBuilderActions.openPreview(role));
    const response = await previewDataModelDelivery(proposalId, kind, role);
    if (!response.success || !response.data) {
      dispatch(DataModelDeliveryBuilderActions.setPreviewStatus({ status: 'error', error: response.error ?? 'Preview failed' }));
      return 500;
    }
    dispatch(DataModelDeliveryPreviewsActions.setPreview({ key: deliveryPreviewKey(proposalId, kind, role), preview: response.data }));
    dispatch(DataModelDeliveryBuilderActions.setPreviewStatus({ status: 'idle' }));
    dispatch(DataModelDeliveryBuilderActions.selectPath(response.data.files[0]?.path ?? ''));
    return 200;
  };
