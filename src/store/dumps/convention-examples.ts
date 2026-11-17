import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConventionExample } from '@/model/convention-example';

/** Examples for the convention currently open on the detail page. */
type ConventionExamplesState = Record<string, ConventionExample>;

const initialState: ConventionExamplesState = {};

export const conventionExamplesSlice = createSlice({
  name: 'conventionExamples',
  initialState,
  reducers: {
    setExamples: (_state, action: PayloadAction<ConventionExample[]>) => {
      const next: ConventionExamplesState = {};
      action.payload.forEach((example) => {
        next[example.id] = example;
      });
      return next;
    },
    upsertExample: (state, action: PayloadAction<ConventionExample>) => {
      state[action.payload.id] = action.payload;
    },
    deleteExample: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const ConventionExamplesActions = conventionExamplesSlice.actions;
export const conventionExamplesReducer = conventionExamplesSlice.reducer;
