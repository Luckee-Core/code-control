import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BuildConvention } from '@/model/build-convention';

const initialState: BuildConvention[] = [];

export const buildConventionsSlice = createSlice({
  name: 'buildConventions',
  initialState,
  reducers: {
    setBuildConventions: (_state, action: PayloadAction<BuildConvention[]>) =>
      action.payload,
    addBuildConvention: (state, action: PayloadAction<BuildConvention>) => {
      state.push(action.payload);
    },
    updateBuildConvention: (state, action: PayloadAction<BuildConvention>) => {
      const i = state.findIndex((c) => c.id === action.payload.id);
      if (i !== -1) state[i] = action.payload;
    },
    deleteBuildConvention: (state, action: PayloadAction<string>) => {
      return state.filter((c) => c.id !== action.payload);
    },
    reset: () => initialState,
  },
});

export const BuildConventionsActions = buildConventionsSlice.actions;
export const buildConventionsReducer = buildConventionsSlice.reducer;
export default buildConventionsSlice.reducer;
