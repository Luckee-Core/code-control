import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SystemBuildRun } from '@/model/system-build-run';

/** Build runs keyed by id. */
type SystemBuildRunsState = Record<string, SystemBuildRun>;

const initialState: SystemBuildRunsState = {};

export const systemBuildRunsSlice = createSlice({
  name: 'systemBuildRuns',
  initialState,
  reducers: {
    /** Replaces one software system's runs with the fetched rows. */
    setForSoftwareSystem: (state, action: PayloadAction<{ softwareSystemId: string; runs: SystemBuildRun[] }>) => {
      Object.values(state).forEach((run) => {
        if (run.software_system_id === action.payload.softwareSystemId) delete state[run.id];
      });
      action.payload.runs.forEach((run) => {
        state[run.id] = run;
      });
    },
    upsertSystemBuildRun: (state, action: PayloadAction<SystemBuildRun>) => {
      state[action.payload.id] = action.payload;
    },
    reset: () => initialState,
  },
});

export const SystemBuildRunsActions = systemBuildRunsSlice.actions;
export const systemBuildRunsReducer = systemBuildRunsSlice.reducer;
