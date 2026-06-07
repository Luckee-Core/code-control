import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CursorGenerationResponse } from '@/model';

export type CursorGenerationResponsesState = CursorGenerationResponse[];

const initialState: CursorGenerationResponsesState = [];

export const cursorGenerationResponsesSlice = createSlice({
  name: 'cursorGenerationResponses',
  initialState,
  reducers: {
    setCursorGenerationResponses: (
      state,
      action: PayloadAction<CursorGenerationResponse[]>
    ) => {
      return action.payload;
    },
    addOrUpdateCursorGenerationResponse: (
      state,
      action: PayloadAction<CursorGenerationResponse>
    ) => {
      const index = state.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
    },
    clearCursorGenerationResponses: () => {
      return [];
    },
  },
});

export const CursorGenerationResponsesActions = cursorGenerationResponsesSlice.actions;
export default cursorGenerationResponsesSlice.reducer;
