import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TicketBuildAiExchangeSummary } from '@/model/ticket-build-ai-exchange';

/** AI call summaries keyed by exchange id. */
type TicketBuildAiExchangesState = Record<string, TicketBuildAiExchangeSummary>;

const initialState: TicketBuildAiExchangesState = {};

export const ticketBuildAiExchangesSlice = createSlice({
  name: 'ticketBuildAiExchanges',
  initialState,
  reducers: {
    /** Replaces one build's AI calls with the fetched rows. */
    setForBuild: (state, action: PayloadAction<{ ticketBuildId: string; exchanges: TicketBuildAiExchangeSummary[] }>) => {
      Object.values(state).forEach((row) => {
        if (row.ticket_build_id === action.payload.ticketBuildId) delete state[row.exchange_id];
      });
      action.payload.exchanges.forEach((row) => {
        state[row.exchange_id] = row;
      });
    },
    reset: () => initialState,
  },
});

export const TicketBuildAiExchangesActions = ticketBuildAiExchangesSlice.actions;
export const ticketBuildAiExchangesReducer = ticketBuildAiExchangesSlice.reducer;
