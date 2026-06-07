import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CursorGenerationExchange } from '@/model';

export type CursorGenerationExchangesState = CursorGenerationExchange[];

const initialState: CursorGenerationExchangesState = [];

export const cursorGenerationExchangesSlice = createSlice({
  name: 'cursorGenerationExchanges',
  initialState,
  reducers: {
    setCursorGenerationExchanges: (
      state,
      action: PayloadAction<CursorGenerationExchange[]>
    ) => {
      return action.payload;
    },
    addOrUpdateCursorGenerationExchange: (
      state,
      action: PayloadAction<CursorGenerationExchange>
    ) => {
      const index = state.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
    },
    clearCursorGenerationExchanges: () => {
      return [];
    },
  },
});

export const CursorGenerationExchangesActions = cursorGenerationExchangesSlice.actions;
export default cursorGenerationExchangesSlice.reducer;
