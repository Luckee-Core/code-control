import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AiCostCall } from '@/model/ai-cost-call';

/** AI calls per software system id (absent = not loaded yet). */
type SoftwareSystemAiCallsState = Record<string, AiCostCall[]>;

const initialState: SoftwareSystemAiCallsState = {};

export const softwareSystemAiCallsSlice = createSlice({
  name: 'softwareSystemAiCalls',
  initialState,
  reducers: {
    /** Replaces one software system's AI calls with the fetched rows. */
    setForSoftwareSystem: (state, action: PayloadAction<{ softwareSystemId: string; calls: AiCostCall[] }>) => {
      state[action.payload.softwareSystemId] = action.payload.calls;
    },
    reset: () => initialState,
  },
});

export const SoftwareSystemAiCallsActions = softwareSystemAiCallsSlice.actions;
export const softwareSystemAiCallsReducer = softwareSystemAiCallsSlice.reducer;
