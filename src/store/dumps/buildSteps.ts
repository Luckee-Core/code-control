import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BuildStep } from '@/model';

type BuildStepsState = Record<string, BuildStep>;

const initialState: BuildStepsState = {};

export const buildStepsSlice = createSlice({
  name: 'buildSteps',
  initialState,
  reducers: {
    setBuildSteps: (state, action: PayloadAction<BuildStep[]>) => {
      const newState: BuildStepsState = {};
      action.payload.forEach((step) => {
        newState[step.id] = step;
      });
      return newState;
    },
    addBuildStep: (state, action: PayloadAction<BuildStep>) => {
      state[action.payload.id] = action.payload;
    },
    updateBuildStep: (state, action: PayloadAction<BuildStep>) => {
      state[action.payload.id] = action.payload;
    },
    removeBuildStep: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const BuildStepsActions = buildStepsSlice.actions;
export default buildStepsSlice.reducer;
