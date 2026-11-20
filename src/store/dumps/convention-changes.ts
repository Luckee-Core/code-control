import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConventionChange } from '@/model/convention-change';

/** Convention change ledger rows keyed by id. */
type ConventionChangesState = Record<string, ConventionChange>;

const initialState: ConventionChangesState = {};

export const conventionChangesSlice = createSlice({
  name: 'conventionChanges',
  initialState,
  reducers: {
    setChanges: (_state, action: PayloadAction<ConventionChange[]>) => Object.fromEntries(action.payload.map((change) => [change.id, change])),
    upsertChanges: (state, action: PayloadAction<ConventionChange[]>) => {
      action.payload.forEach((change) => {
        state[change.id] = change;
      });
    },
    reset: () => initialState,
  },
});

export const ConventionChangesActions = conventionChangesSlice.actions;
export const conventionChangesReducer = conventionChangesSlice.reducer;
