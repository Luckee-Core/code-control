import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BuildExample } from '@/model/build-example';

const initialState: BuildExample[] = [];

export const buildExamplesSlice = createSlice({
  name: 'buildExamples',
  initialState,
  reducers: {
    setBuildExamples: (_state, action: PayloadAction<BuildExample[]>) =>
      action.payload,
    addBuildExample: (state, action: PayloadAction<BuildExample>) => {
      state.push(action.payload);
    },
    updateBuildExample: (state, action: PayloadAction<BuildExample>) => {
      const i = state.findIndex((e) => e.id === action.payload.id);
      if (i !== -1) state[i] = action.payload;
    },
    deleteBuildExample: (state, action: PayloadAction<string>) => {
      return state.filter((e) => e.id !== action.payload);
    },
    reset: () => initialState,
  },
});

export const BuildExamplesActions = buildExamplesSlice.actions;
export const buildExamplesReducer = buildExamplesSlice.reducer;
export default buildExamplesSlice.reducer;
