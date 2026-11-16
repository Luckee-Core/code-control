import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConventionSeverity, ConventionStatus } from '@/model/convention';
import type { ConventionExampleKind, ConventionExampleLanguage } from '@/model/convention-example';

export type ConventionCreateForm = {
  key: string;
  domain_key: string;
  topic_key: string;
  title: string;
  statement: string;
  rationale: string;
  severity: ConventionSeverity;
  status: ConventionStatus;
};

export type ConventionExampleDraft = {
  title: string;
  kind: ConventionExampleKind;
  language: ConventionExampleLanguage;
  path_hint: string;
  code: string;
  note: string;
};

export type ConventionSourceDraft = {
  repo: string;
  adr_path: string;
  excerpt: string;
};

type ConventionBuilderState = {
  isCreateModalOpen: boolean;
  createForm: ConventionCreateForm;
  exampleDraft: ConventionExampleDraft;
  sourceDraft: ConventionSourceDraft;
  isSaving: boolean;
  error: string | null;
};

const emptyCreateForm: ConventionCreateForm = {
  key: '',
  domain_key: '',
  topic_key: '',
  title: '',
  statement: '',
  rationale: '',
  severity: 'must',
  status: 'draft',
};

const emptyExampleDraft: ConventionExampleDraft = {
  title: '',
  kind: 'correct',
  language: 'ts',
  path_hint: '',
  code: '',
  note: '',
};

const emptySourceDraft: ConventionSourceDraft = { repo: '', adr_path: '', excerpt: '' };

const initialState: ConventionBuilderState = {
  isCreateModalOpen: false,
  createForm: emptyCreateForm,
  exampleDraft: emptyExampleDraft,
  sourceDraft: emptySourceDraft,
  isSaving: false,
  error: null,
};

export const conventionBuilderSlice = createSlice({
  name: 'conventionBuilder',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
      state.createForm = emptyCreateForm;
      state.error = null;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
      state.error = null;
    },
    updateCreateForm: (state, action: PayloadAction<Partial<ConventionCreateForm>>) => {
      state.createForm = { ...state.createForm, ...action.payload };
    },
    updateExampleDraft: (state, action: PayloadAction<Partial<ConventionExampleDraft>>) => {
      state.exampleDraft = { ...state.exampleDraft, ...action.payload };
    },
    resetExampleDraft: (state) => {
      state.exampleDraft = emptyExampleDraft;
    },
    updateSourceDraft: (state, action: PayloadAction<Partial<ConventionSourceDraft>>) => {
      state.sourceDraft = { ...state.sourceDraft, ...action.payload };
    },
    resetSourceDraft: (state) => {
      state.sourceDraft = emptySourceDraft;
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    reset: () => initialState,
  },
});

export const ConventionBuilderActions = conventionBuilderSlice.actions;
export const conventionBuilderReducer = conventionBuilderSlice.reducer;
