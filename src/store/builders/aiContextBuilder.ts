import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConventionSnapshot } from '@/model/convention-snapshot';
import type { AiContext, AiContextSnapshotResult } from '@/model/convention-responses';

type AiContextStatus = 'idle' | 'loading' | 'error';

type AiContextBuilderState = {
  domainKey: string;
  roleKey: string;
  preview: AiContext | null;
  lastSnapshot: AiContextSnapshotResult | null;
  viewingSnapshot: ConventionSnapshot | null;
  status: AiContextStatus;
  error: string | null;
};

const initialState: AiContextBuilderState = {
  domainKey: 'data_model',
  roleKey: 'storage',
  preview: null,
  lastSnapshot: null,
  viewingSnapshot: null,
  status: 'idle',
  error: null,
};

export const aiContextBuilderSlice = createSlice({
  name: 'aiContextBuilder',
  initialState,
  reducers: {
    setDomainKey: (state, action: PayloadAction<string>) => {
      state.domainKey = action.payload;
      state.preview = null;
      state.lastSnapshot = null;
    },
    setRoleKey: (state, action: PayloadAction<string>) => {
      state.roleKey = action.payload;
      state.preview = null;
      state.lastSnapshot = null;
    },
    setStatus: (state, action: PayloadAction<AiContextStatus>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = action.payload ? 'error' : 'idle';
    },
    setPreview: (state, action: PayloadAction<AiContext>) => {
      state.preview = action.payload;
      state.status = 'idle';
      state.error = null;
    },
    setLastSnapshot: (state, action: PayloadAction<AiContextSnapshotResult>) => {
      state.lastSnapshot = action.payload;
      state.status = 'idle';
      state.error = null;
    },
    setViewingSnapshot: (state, action: PayloadAction<ConventionSnapshot | null>) => {
      state.viewingSnapshot = action.payload;
    },
    reset: () => initialState,
  },
});

export const AiContextBuilderActions = aiContextBuilderSlice.actions;
export const aiContextBuilderReducer = aiContextBuilderSlice.reducer;
