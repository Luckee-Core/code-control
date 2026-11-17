import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SubmitStatus = 'idle' | 'submitting' | 'error';

type DataModelBuilderState = {
  /** Software system the drafts and selection belong to (reset when it changes). */
  softwareSystemId: string;
  selectedProposalId: string | null;
  contextDraft: string;
  feedbackDraft: string;
  isLoading: boolean;
  loadError: string | null;
  submitStatus: SubmitStatus;
  submitError: string | null;
};

const initialState: DataModelBuilderState = {
  softwareSystemId: '',
  selectedProposalId: null,
  contextDraft: '',
  feedbackDraft: '',
  isLoading: false,
  loadError: null,
  submitStatus: 'idle',
  submitError: null,
};

const dataModelBuilderSlice = createSlice({
  name: 'dataModelBuilder',
  initialState,
  reducers: {
    startForSoftwareSystem: (state, action: PayloadAction<string>) => {
      if (state.softwareSystemId === action.payload) return;
      return { ...initialState, softwareSystemId: action.payload };
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; error?: string | null }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadError = action.payload.error ?? null;
    },
    selectProposal: (state, action: PayloadAction<string | null>) => {
      state.selectedProposalId = action.payload;
      state.feedbackDraft = '';
      state.submitStatus = 'idle';
      state.submitError = null;
    },
    setContextDraft: (state, action: PayloadAction<string>) => {
      state.contextDraft = action.payload;
    },
    setFeedbackDraft: (state, action: PayloadAction<string>) => {
      state.feedbackDraft = action.payload;
    },
    setSubmitStatus: (state, action: PayloadAction<{ status: SubmitStatus; error?: string | null }>) => {
      state.submitStatus = action.payload.status;
      state.submitError = action.payload.error ?? null;
    },
    reset: () => initialState,
  },
});

export const DataModelBuilderActions = dataModelBuilderSlice.actions;
export const dataModelBuilderReducer = dataModelBuilderSlice.reducer;
