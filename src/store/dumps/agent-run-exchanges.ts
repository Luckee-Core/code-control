import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AiExchange } from '@/model/agent-run';

/** AI calls with prompt/response bodies keyed by exchange id (loaded on demand). */
type AgentRunExchangesState = Record<string, AiExchange>;

const initialState: AgentRunExchangesState = {};

export const agentRunExchangesSlice = createSlice({
  name: 'agentRunExchanges',
  initialState,
  reducers: {
    setExchange: (state, action: PayloadAction<AiExchange>) => {
      state[action.payload.id] = action.payload;
    },
    reset: () => initialState,
  },
});

export const AgentRunExchangesActions = agentRunExchangesSlice.actions;
export const agentRunExchangesReducer = agentRunExchangesSlice.reducer;
