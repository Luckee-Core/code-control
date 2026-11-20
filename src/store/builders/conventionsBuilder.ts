import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  CreateConventionExamplePayload,
  CreateConventionSourcePayload,
} from '@/api/conventions/types';

type SaveStatus = 'idle' | 'saving' | 'error';

type ConventionsBuilderState = {
  isFormModalOpen: boolean;
  /** check_config edited as JSON text; parsed on save. */
  checkConfigText: string;
  /** Why this edit is made (recorded in the convention change ledger). */
  changeReason: string;
  saveStatus: SaveStatus;
  saveError: string | null;
  isLoadingDetail: boolean;
  exampleDraft: CreateConventionExamplePayload;
  isExampleFormOpen: boolean;
  sourceDraft: CreateConventionSourcePayload;
  isSourceFormOpen: boolean;
};

const EMPTY_EXAMPLE: CreateConventionExamplePayload = {
  title: '',
  kind: 'correct',
  language: 'sql',
  path_hint: null,
  code: '',
  note: '',
};

const EMPTY_SOURCE: CreateConventionSourcePayload = { repo: '', adr_path: '', excerpt: '' };

const initialState: ConventionsBuilderState = {
  isFormModalOpen: false,
  checkConfigText: '',
  changeReason: '',
  saveStatus: 'idle',
  saveError: null,
  isLoadingDetail: false,
  exampleDraft: EMPTY_EXAMPLE,
  isExampleFormOpen: false,
  sourceDraft: EMPTY_SOURCE,
  isSourceFormOpen: false,
};

const conventionsBuilderSlice = createSlice({
  name: 'conventionsBuilder',
  initialState,
  reducers: {
    openFormModal: (state, action: PayloadAction<{ checkConfigText: string }>) => {
      state.isFormModalOpen = true;
      state.checkConfigText = action.payload.checkConfigText;
      state.changeReason = '';
      state.saveStatus = 'idle';
      state.saveError = null;
    },
    closeFormModal: (state) => {
      state.isFormModalOpen = false;
      state.saveStatus = 'idle';
      state.saveError = null;
    },
    setCheckConfigText: (state, action: PayloadAction<string>) => {
      state.checkConfigText = action.payload;
    },
    setChangeReason: (state, action: PayloadAction<string>) => {
      state.changeReason = action.payload;
    },
    setSaveStatus: (state, action: PayloadAction<{ status: SaveStatus; error?: string | null }>) => {
      state.saveStatus = action.payload.status;
      state.saveError = action.payload.error ?? null;
    },
    setLoadingDetail: (state, action: PayloadAction<boolean>) => {
      state.isLoadingDetail = action.payload;
    },
    openExampleForm: (state) => {
      state.isExampleFormOpen = true;
      state.exampleDraft = EMPTY_EXAMPLE;
    },
    closeExampleForm: (state) => {
      state.isExampleFormOpen = false;
      state.exampleDraft = EMPTY_EXAMPLE;
    },
    updateExampleDraft: (state, action: PayloadAction<Partial<CreateConventionExamplePayload>>) => {
      state.exampleDraft = { ...state.exampleDraft, ...action.payload };
    },
    openSourceForm: (state) => {
      state.isSourceFormOpen = true;
      state.sourceDraft = EMPTY_SOURCE;
    },
    closeSourceForm: (state) => {
      state.isSourceFormOpen = false;
      state.sourceDraft = EMPTY_SOURCE;
    },
    updateSourceDraft: (state, action: PayloadAction<Partial<CreateConventionSourcePayload>>) => {
      state.sourceDraft = { ...state.sourceDraft, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const ConventionsBuilderActions = conventionsBuilderSlice.actions;
export const conventionsBuilderReducer = conventionsBuilderSlice.reducer;
