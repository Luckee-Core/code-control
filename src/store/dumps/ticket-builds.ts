import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TicketBuild } from '@/model/ticket-build';

/** Ticket builds keyed by id. */
type TicketBuildsState = Record<string, TicketBuild>;

const initialState: TicketBuildsState = {};

export const ticketBuildsSlice = createSlice({
  name: 'ticketBuilds',
  initialState,
  reducers: {
    /** Replaces one software system's builds with the fetched rows. */
    setForSoftwareSystem: (state, action: PayloadAction<{ softwareSystemId: string; builds: TicketBuild[] }>) => {
      Object.values(state).forEach((build) => {
        if (build.software_system_id === action.payload.softwareSystemId) delete state[build.id];
      });
      action.payload.builds.forEach((build) => {
        state[build.id] = build;
      });
    },
    upsertTicketBuild: (state, action: PayloadAction<TicketBuild>) => {
      state[action.payload.id] = action.payload;
    },
    reset: () => initialState,
  },
});

export const TicketBuildsActions = ticketBuildsSlice.actions;
export const ticketBuildsReducer = ticketBuildsSlice.reducer;
