import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SubmitStatus = 'idle' | 'submitting' | 'error';

/** Ticket build UI state — primitives only. */
type TicketBuildBuilderState = {
  submitStatus: SubmitStatus;
  submitError: string | null;
  feedbackDraft: string;
  isReviseOpen: boolean;
  isLoadingList: boolean;
};

const initialState: TicketBuildBuilderState = {
  submitStatus: 'idle',
  submitError: null,
  feedbackDraft: '',
  isReviseOpen: false,
  isLoadingList: false,
};

const ticketBuildBuilderSlice = createSlice({
  name: 'ticketBuildBuilder',
  initialState,
  reducers: {
    setSubmitStatus: (state, action: PayloadAction<{ status: SubmitStatus; error?: string | null }>) => {
      state.submitStatus = action.payload.status;
      state.submitError = action.payload.error ?? null;
    },
    setFeedbackDraft: (state, action: PayloadAction<string>) => {
      state.feedbackDraft = action.payload;
    },
    setReviseOpen: (state, action: PayloadAction<boolean>) => {
      state.isReviseOpen = action.payload;
    },
    setLoadingList: (state, action: PayloadAction<boolean>) => {
      state.isLoadingList = action.payload;
    },
    reset: () => initialState,
  },
});

export const TicketBuildBuilderActions = ticketBuildBuilderSlice.actions;
export const ticketBuildBuilderReducer = ticketBuildBuilderSlice.reducer;
