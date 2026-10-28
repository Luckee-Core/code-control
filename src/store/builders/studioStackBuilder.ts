import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type StudioStackStatus = 'unknown' | 'checking' | 'ready' | 'unavailable';

export type StudioStackHealthLine = {
  label: string;
  status: string;
  tone: 'ok' | 'warn' | 'bad' | 'muted';
};

export type StudioStackBuilderState = {
  status: StudioStackStatus;
  isProbing: boolean;
  lastCheckedAt: string;
  errorMessage: string;
  errorHint: string;
  healthLines: StudioStackHealthLine[];
};

const initialState: StudioStackBuilderState = {
  status: 'unknown',
  isProbing: false,
  lastCheckedAt: '',
  errorMessage: '',
  errorHint: '',
  healthLines: [],
};

export const studioStackBuilderSlice = createSlice({
  name: 'studioStackBuilder',
  initialState,
  reducers: {
    setStudioStackStatus: (state, action: PayloadAction<StudioStackStatus>) => {
      state.status = action.payload;
    },
    setStudioStackError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setStudioStackErrorHint: (state, action: PayloadAction<string>) => {
      state.errorHint = action.payload;
    },
    setStudioStackLastCheckedAt: (state, action: PayloadAction<string>) => {
      state.lastCheckedAt = action.payload;
    },
    setStudioStackHealthLines: (state, action: PayloadAction<StudioStackHealthLine[]>) => {
      state.healthLines = action.payload;
    },
    setStudioStackProbing: (state, action: PayloadAction<boolean>) => {
      state.isProbing = action.payload;
    },
    resetStudioStack: () => initialState,
  },
});

export const StudioStackBuilderActions = studioStackBuilderSlice.actions;
export const studioStackBuilderReducer = studioStackBuilderSlice.reducer;
