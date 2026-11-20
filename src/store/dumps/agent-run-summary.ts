import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AgentRunSummary } from '@/api/agent-runs';

/** Open runs per agent (sidebar badges). */
type AgentRunSummaryState = AgentRunSummary;

const initialState: AgentRunSummaryState = { pr: { waiting: 0 }, convention: { waiting: 0 }, template: { waiting: 0 } };

export const agentRunSummarySlice = createSlice({
  name: 'agentRunSummary',
  initialState,
  reducers: {
    setSummary: (_state, action: PayloadAction<AgentRunSummary>) => action.payload,
    reset: () => initialState,
  },
});

export const AgentRunSummaryActions = agentRunSummarySlice.actions;
export const agentRunSummaryReducer = agentRunSummarySlice.reducer;
