import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Convention } from '@/model/convention';

type ConventionsState = Record<string, Convention>;

const initialState: ConventionsState = {};

export const conventionsSlice = createSlice({
  name: 'conventions',
  initialState,
  reducers: {
    setConventions: (_state, action: PayloadAction<Convention[]>) => {
      const next: ConventionsState = {};
      action.payload.forEach((convention) => {
        next[convention.id] = convention;
      });
      return next;
    },
    upsertConvention: (state, action: PayloadAction<Convention>) => {
      state[action.payload.id] = action.payload;
    },
    deleteConvention: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const ConventionsActions = conventionsSlice.actions;
export const conventionsReducer = conventionsSlice.reducer;
