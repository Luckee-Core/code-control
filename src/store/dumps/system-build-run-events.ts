import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SystemBuildRunEvent } from '@/model/system-build-run-event';

/** Build run log entries keyed by id. */
type SystemBuildRunEventsState = Record<string, SystemBuildRunEvent>;

const initialState: SystemBuildRunEventsState = {};

export const systemBuildRunEventsSlice = createSlice({
  name: 'systemBuildRunEvents',
  initialState,
  reducers: {
    /** Replaces one run's log with the fetched rows. */
    setForRun: (state, action: PayloadAction<{ runId: string; events: SystemBuildRunEvent[] }>) => {
      Object.values(state).forEach((event) => {
        if (event.run_id === action.payload.runId) delete state[event.id];
      });
      action.payload.events.forEach((event) => {
        state[event.id] = event;
      });
    },
    reset: () => initialState,
  },
});

export const SystemBuildRunEventsActions = systemBuildRunEventsSlice.actions;
export const systemBuildRunEventsReducer = systemBuildRunEventsSlice.reducer;
