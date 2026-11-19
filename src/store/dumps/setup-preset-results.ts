import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SetupPresetRepoResult } from '@/model/setup-preset';

/** Last apply-preset results per software system id (this session). */
type SetupPresetResultsState = Record<string, SetupPresetRepoResult[]>;

const initialState: SetupPresetResultsState = {};

export const setupPresetResultsSlice = createSlice({
  name: 'setupPresetResults',
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<{ softwareSystemId: string; results: SetupPresetRepoResult[] }>) => {
      state[action.payload.softwareSystemId] = action.payload.results;
    },
    reset: () => initialState,
  },
});

export const SetupPresetResultsActions = setupPresetResultsSlice.actions;
export const setupPresetResultsReducer = setupPresetResultsSlice.reducer;
