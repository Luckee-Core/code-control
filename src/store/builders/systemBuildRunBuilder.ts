import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SubmitStatus = 'idle' | 'submitting' | 'error';

/** Build all UI state — primitives only. */
type SystemBuildRunBuilderState = {
  /** Software system whose runs are loaded (reload when it changes). */
  softwareSystemId: string | null;
  isLoading: boolean;
  submitStatus: SubmitStatus;
  submitError: string | null;
  isLogOpen: boolean;
};

const initialState: SystemBuildRunBuilderState = {
  softwareSystemId: null,
  isLoading: false,
  submitStatus: 'idle',
  submitError: null,
  isLogOpen: false,
};

const systemBuildRunBuilderSlice = createSlice({
  name: 'systemBuildRunBuilder',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ softwareSystemId: string; isLoading: boolean }>) => {
      state.softwareSystemId = action.payload.softwareSystemId;
      state.isLoading = action.payload.isLoading;
    },
    setSubmitStatus: (state, action: PayloadAction<{ status: SubmitStatus; error?: string | null }>) => {
      state.submitStatus = action.payload.status;
      state.submitError = action.payload.error ?? null;
    },
    setLogOpen: (state, action: PayloadAction<boolean>) => {
      state.isLogOpen = action.payload;
    },
    reset: () => initialState,
  },
});

export const SystemBuildRunBuilderActions = systemBuildRunBuilderSlice.actions;
export const systemBuildRunBuilderReducer = systemBuildRunBuilderSlice.reducer;
