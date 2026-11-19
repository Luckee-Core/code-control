import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TicketBuild } from '@/model/ticket-build';

export const EMPTY_TICKET_BUILD: TicketBuild = {
  id: '',
  software_system_id: '',
  ops_ticket_id: '',
  ops_ticket_title: '',
  ops_ticket_description: null,
  status: 'planning',
  summary: '',
  contract_text: '',
  missing_roles_note: '',
  feedback: '',
  research_used: false,
  model: '',
  input_tokens: 0,
  output_tokens: 0,
  error: null,
  approved_at: null,
  ops_synced_at: null,
  created_at: '',
  updated_at: '',
};

/** The ticket build open on the detail page (holds the object). */
export const currentTicketBuildSlice = createSlice({
  name: 'currentTicketBuild',
  initialState: EMPTY_TICKET_BUILD,
  reducers: {
    setCurrentTicketBuild: (_state, action: PayloadAction<TicketBuild>) => action.payload,
    reset: () => EMPTY_TICKET_BUILD,
  },
});

export const CurrentTicketBuildActions = currentTicketBuildSlice.actions;
export const currentTicketBuildReducer = currentTicketBuildSlice.reducer;
