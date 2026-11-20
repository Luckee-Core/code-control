import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AgentRunDetail } from '@/api/agent-runs';

/** Full agent run detail (lineage, versions, agent data) keyed by run id. */
type AgentRunDetailsState = Record<string, AgentRunDetail>;

const initialState: AgentRunDetailsState = {};

export const agentRunDetailsSlice = createSlice({
  name: 'agentRunDetails',
  initialState,
  reducers: {
    setDetail: (state, action: PayloadAction<AgentRunDetail>) => {
      state[action.payload.run.id] = action.payload;
    },
    reset: () => initialState,
  },
});

export const AgentRunDetailsActions = agentRunDetailsSlice.actions;
export const agentRunDetailsReducer = agentRunDetailsSlice.reducer;
