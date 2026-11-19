import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TicketBuildRepo } from '@/model/ticket-build-repo';

/** Ticket build repos keyed by id. */
type TicketBuildReposState = Record<string, TicketBuildRepo>;

const initialState: TicketBuildReposState = {};

export const ticketBuildReposSlice = createSlice({
  name: 'ticketBuildRepos',
  initialState,
  reducers: {
    /** Replaces one build's repos with the fetched rows. */
    setForBuild: (state, action: PayloadAction<{ ticketBuildId: string; repos: TicketBuildRepo[] }>) => {
      Object.values(state).forEach((repo) => {
        if (repo.ticket_build_id === action.payload.ticketBuildId) delete state[repo.id];
      });
      action.payload.repos.forEach((repo) => {
        state[repo.id] = repo;
      });
    },
    upsertTicketBuildRepo: (state, action: PayloadAction<TicketBuildRepo>) => {
      state[action.payload.id] = action.payload;
    },
    reset: () => initialState,
  },
});

export const TicketBuildReposActions = ticketBuildReposSlice.actions;
export const ticketBuildReposReducer = ticketBuildReposSlice.reducer;
