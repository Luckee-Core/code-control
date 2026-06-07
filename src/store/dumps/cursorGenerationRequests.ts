import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CursorGenerationRequest } from '@/model';

export type CursorGenerationRequestsState = CursorGenerationRequest[];

const initialState: CursorGenerationRequestsState = [];

export const cursorGenerationRequestsSlice = createSlice({
  name: 'cursorGenerationRequests',
  initialState,
  reducers: {
    setCursorGenerationRequests: (
      state,
      action: PayloadAction<CursorGenerationRequest[]>
    ) => {
      return action.payload;
    },
    clearCursorGenerationRequests: () => {
      return [];
    },
  },
});

export const CursorGenerationRequestsActions = cursorGenerationRequestsSlice.actions;
export default cursorGenerationRequestsSlice.reducer;
