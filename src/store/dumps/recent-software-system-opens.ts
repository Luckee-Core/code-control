import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RecentSoftwareSystemOpen } from '@/model/software-system-open';

/** When each software system was last opened, keyed by software_system_id. */
type RecentSoftwareSystemOpensState = Record<string, RecentSoftwareSystemOpen>;

const initialState: RecentSoftwareSystemOpensState = {};

export const recentSoftwareSystemOpensSlice = createSlice({
  name: 'recentSoftwareSystemOpens',
  initialState,
  reducers: {
    /** Replaces the list with the fetched rows. */
    setRecentSoftwareSystemOpens: (_state, action: PayloadAction<RecentSoftwareSystemOpen[]>) => {
      const next: RecentSoftwareSystemOpensState = {};
      action.payload.forEach((open) => {
        next[open.software_system_id] = open;
      });
      return next;
    },
    /** Moves one system to the top after it is opened. */
    upsertRecentSoftwareSystemOpen: (state, action: PayloadAction<RecentSoftwareSystemOpen>) => {
      state[action.payload.software_system_id] = action.payload;
    },
    reset: () => initialState,
  },
});

export const RecentSoftwareSystemOpensActions = recentSoftwareSystemOpensSlice.actions;
export const recentSoftwareSystemOpensReducer = recentSoftwareSystemOpensSlice.reducer;
