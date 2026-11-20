import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** The agent run open on a detail page (PR, convention or template). */
export type CurrentAgentRunState = { id: string };

const initialState: CurrentAgentRunState = { id: '' };

export const currentAgentRunSlice = createSlice({
  name: 'currentAgentRun',
  initialState,
  reducers: {
    setId: (_state, action: PayloadAction<string>) => ({ id: action.payload }),
    reset: () => initialState,
  },
});

export const CurrentAgentRunActions = currentAgentRunSlice.actions;
export const currentAgentRunReducer = currentAgentRunSlice.reducer;
