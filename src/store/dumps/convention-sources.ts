import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConventionSource } from '@/model/convention-source';

/** Sources for the convention currently open on the detail page. */
type ConventionSourcesState = Record<string, ConventionSource>;

const initialState: ConventionSourcesState = {};

export const conventionSourcesSlice = createSlice({
  name: 'conventionSources',
  initialState,
  reducers: {
    setSources: (_state, action: PayloadAction<ConventionSource[]>) => {
      const next: ConventionSourcesState = {};
      action.payload.forEach((source) => {
        next[source.id] = source;
      });
      return next;
    },
    upsertSource: (state, action: PayloadAction<ConventionSource>) => {
      state[action.payload.id] = action.payload;
    },
    deleteSource: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const ConventionSourcesActions = conventionSourcesSlice.actions;
export const conventionSourcesReducer = conventionSourcesSlice.reducer;
