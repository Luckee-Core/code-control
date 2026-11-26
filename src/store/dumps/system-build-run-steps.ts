import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SystemBuildRunStep } from '@/model/system-build-run-step';

/** Build run steps keyed by id. */
type SystemBuildRunStepsState = Record<string, SystemBuildRunStep>;

const initialState: SystemBuildRunStepsState = {};

export const systemBuildRunStepsSlice = createSlice({
  name: 'systemBuildRunSteps',
  initialState,
  reducers: {
    /** Replaces one run's steps with the fetched rows. */
    setForRun: (state, action: PayloadAction<{ runId: string; steps: SystemBuildRunStep[] }>) => {
      Object.values(state).forEach((step) => {
        if (step.run_id === action.payload.runId) delete state[step.id];
      });
      action.payload.steps.forEach((step) => {
        state[step.id] = step;
      });
    },
    reset: () => initialState,
  },
});

export const SystemBuildRunStepsActions = systemBuildRunStepsSlice.actions;
export const systemBuildRunStepsReducer = systemBuildRunStepsSlice.reducer;
