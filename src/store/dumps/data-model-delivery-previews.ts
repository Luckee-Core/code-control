import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DeliveryPreview } from '@/api/data-model-deliveries';

/** Rendered file previews keyed by `${proposalId}:${role}`. */
type DataModelDeliveryPreviewsState = Record<string, DeliveryPreview>;

const initialState: DataModelDeliveryPreviewsState = {};

export const dataModelDeliveryPreviewsSlice = createSlice({
  name: 'dataModelDeliveryPreviews',
  initialState,
  reducers: {
    setPreview: (state, action: PayloadAction<{ key: string; preview: DeliveryPreview }>) => {
      state[action.payload.key] = action.payload.preview;
    },
    reset: () => initialState,
  },
});

export const DataModelDeliveryPreviewsActions = dataModelDeliveryPreviewsSlice.actions;
export const dataModelDeliveryPreviewsReducer = dataModelDeliveryPreviewsSlice.reducer;

/** Key for a proposal + role preview. */
export const deliveryPreviewKey = (proposalId: string, role: string): string => `${proposalId}:${role}`;
