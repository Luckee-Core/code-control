import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConventionOptions } from '@/model/convention-responses';

const initialState: ConventionOptions = { domains: [], topics: [], repo_roles: [] };

export const conventionOptionsSlice = createSlice({
  name: 'conventionOptions',
  initialState,
  reducers: {
    setConventionOptions: (_state, action: PayloadAction<ConventionOptions>) => action.payload,
    reset: () => initialState,
  },
});

export const ConventionOptionsActions = conventionOptionsSlice.actions;
export const conventionOptionsReducer = conventionOptionsSlice.reducer;
