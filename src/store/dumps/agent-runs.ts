import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AgentRunListItem } from '@/api/agent-runs';
import type { AgentRun } from '@/model/agent-run';

/** Agent run list rows (all agents) keyed by id. */
type AgentRunsState = Record<string, AgentRunListItem>;

const initialState: AgentRunsState = {};

export const agentRunsSlice = createSlice({
  name: 'agentRuns',
  initialState,
  reducers: {
    upsertRuns: (state, action: PayloadAction<AgentRunListItem[]>) => {
      action.payload.forEach((run) => {
        state[run.id] = run;
      });
    },
    /** Updates a run's own fields, keeping the list enrichment (project, PR) already loaded. */
    patchRun: (state, action: PayloadAction<AgentRun>) => {
      const existing = state[action.payload.id];
      state[action.payload.id] = existing
        ? { ...existing, ...action.payload }
        : { ...action.payload, software_system_name: null, delivery: null, template_changes: [] };
    },
    reset: () => initialState,
  },
});

export const AgentRunsActions = agentRunsSlice.actions;
export const agentRunsReducer = agentRunsSlice.reducer;
