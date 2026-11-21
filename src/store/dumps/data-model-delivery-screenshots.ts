import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DeliveryScreenshot } from '@/api/data-model-deliveries';

/** Template preview screenshots keyed by deliveryPreviewKey(proposalId, kind, role). */
type DataModelDeliveryScreenshotsState = Record<string, DeliveryScreenshot>;

const initialState: DataModelDeliveryScreenshotsState = {};

export const dataModelDeliveryScreenshotsSlice = createSlice({
  name: 'dataModelDeliveryScreenshots',
  initialState,
  reducers: {
    setScreenshot: (state, action: PayloadAction<{ key: string; screenshot: DeliveryScreenshot }>) => {
      state[action.payload.key] = action.payload.screenshot;
    },
    reset: () => initialState,
  },
});

export const DataModelDeliveryScreenshotsActions = dataModelDeliveryScreenshotsSlice.actions;
export const dataModelDeliveryScreenshotsReducer = dataModelDeliveryScreenshotsSlice.reducer;
