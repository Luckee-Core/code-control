import { previewDataModelDelivery, type DeliveryRole } from '@/api/data-model-deliveries';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DataModelDeliveryPreviewsActions, deliveryPreviewKey } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Renders the files a delivery would write for one role (against the repo's default branch)
 * and opens the preview on the first file.
 */
export const openDeliveryPreviewThunk =
  (role: DeliveryRole): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const proposalId = getState().dataModelBuilder.selectedProposalId;
    if (!proposalId) return 400;
    dispatch(DataModelDeliveryBuilderActions.openPreview(role));
    const response = await previewDataModelDelivery(proposalId, role);
    if (!response.success || !response.data) {
      dispatch(DataModelDeliveryBuilderActions.setPreviewStatus({ status: 'error', error: response.error ?? 'Preview failed' }));
      return 500;
    }
    dispatch(DataModelDeliveryPreviewsActions.setPreview({ key: deliveryPreviewKey(proposalId, role), preview: response.data }));
    dispatch(DataModelDeliveryBuilderActions.setPreviewStatus({ status: 'idle' }));
    dispatch(DataModelDeliveryBuilderActions.selectPath(response.data.files[0]?.path ?? ''));
    return 200;
  };
