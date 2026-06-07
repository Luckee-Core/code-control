import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BuildStep } from '@/model';

type CurrentBuildStepState = BuildStep | null;

const initialState: CurrentBuildStepState = null;

export const currentBuildStepSlice = createSlice({
  name: 'currentBuildStep',
  initialState: null as CurrentBuildStepState,
  reducers: {
    setCurrentBuildStep: (state, action: PayloadAction<BuildStep | null>) => {
      return action.payload;
    },
    updateCurrentBuildStepField: (
      state,
      action: PayloadAction<{ field: keyof BuildStep; value: any }>
    ) => {
      if (state) {
        (state as any)[action.payload.field] = action.payload.value;
      }
    },
    clearCurrentBuildStep: (state, _action: PayloadAction<void>) => {
      return null;
    },
  },
});

export const CurrentBuildStepActions = currentBuildStepSlice.actions;
export default currentBuildStepSlice.reducer;
