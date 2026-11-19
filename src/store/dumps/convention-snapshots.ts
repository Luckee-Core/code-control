import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConventionSnapshotSummary } from '@/model/convention-snapshot';

/** Newest first, as returned by Express. */
type ConventionSnapshotsState = ConventionSnapshotSummary[];

const initialState: ConventionSnapshotsState = [];

export const conventionSnapshotsSlice = createSlice({
  name: 'conventionSnapshots',
  initialState,
  reducers: {
    setConventionSnapshots: (_state, action: PayloadAction<ConventionSnapshotSummary[]>) => action.payload,
    reset: () => initialState,
  },
});

export const ConventionSnapshotsActions = conventionSnapshotsSlice.actions;
export const conventionSnapshotsReducer = conventionSnapshotsSlice.reducer;
