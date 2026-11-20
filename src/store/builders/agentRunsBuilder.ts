import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Status = 'idle' | 'loading' | 'error';
export type AgentRunAction = '' | 'save' | 'confirm' | 'approve' | 'reject' | 'revise' | 'dismiss' | 'retry';
export type DecisionDraft = { action: '' | 'accept' | 'reject'; afterText: string; editing: boolean };
export type AgentRunListFilters = { status: string; search: string };

type AgentRunsBuilderState = {
  listStatus: Status;
  listError: string | null;
  filters: Record<string, AgentRunListFilters>;
  detailStatus: Status;
  detailError: string | null;
  /** Action in flight on the open run ('' = none) and its last error. */
  action: AgentRunAction;
  actionError: string | null;
  actionNotice: string | null;
  /** Draft form: instructions (all agents) and PR feedback / focus files. */
  instructions: string;
  draftFeedback: string;
  draftFocusPaths: string[];
  /** Template draft: which carried changes to keep in scope. */
  scope: Record<string, boolean>;
  /** Review form. */
  decisionNote: string;
  reviseFeedback: string;
  revertChanges: boolean;
  decisions: Record<string, DecisionDraft>;
  /** Detail page UI. */
  selectedPath: string;
  openExchangeId: string;
  templateTab: 'files' | 'preview' | 'changes';
  /** Template run detail: the template repo being viewed (owner/name). */
  templateRepo: string;
  diffScope: 'pr' | 'run';
  viewStatus: Status;
  viewError: string | null;
  /** Update PR modal (Data access rows). */
  updatePr: { open: boolean; deliveryId: string; feedback: string; focusPaths: string[]; status: Status; error: string | null };
  historyStatus: Status;
  historyError: string | null;
};

const initialState: AgentRunsBuilderState = {
  listStatus: 'idle',
  listError: null,
  filters: {},
  detailStatus: 'idle',
  detailError: null,
  action: '',
  actionError: null,
  actionNotice: null,
  instructions: '',
  draftFeedback: '',
  draftFocusPaths: [],
  scope: {},
  decisionNote: '',
  reviseFeedback: '',
  revertChanges: false,
  decisions: {},
  selectedPath: '',
  openExchangeId: '',
  templateTab: 'files',
  templateRepo: '',
  diffScope: 'pr',
  viewStatus: 'idle',
  viewError: null,
  updatePr: { open: false, deliveryId: '', feedback: '', focusPaths: [], status: 'idle', error: null },
  historyStatus: 'idle',
  historyError: null,
};

const agentRunsBuilderSlice = createSlice({
  name: 'agentRunsBuilder',
  initialState,
  reducers: {
    setList: (state, action: PayloadAction<{ status: Status; error?: string | null }>) => {
      state.listStatus = action.payload.status;
      state.listError = action.payload.error ?? null;
    },
    setFilters: (state, action: PayloadAction<{ agent: string; filters: Partial<AgentRunListFilters> }>) => {
      const current = state.filters[action.payload.agent] ?? { status: '', search: '' };
      state.filters[action.payload.agent] = { ...current, ...action.payload.filters };
    },
    setDetail: (state, action: PayloadAction<{ status: Status; error?: string | null }>) => {
      state.detailStatus = action.payload.status;
      state.detailError = action.payload.error ?? null;
    },
    /** Resets the per-run forms when another run is opened. */
    openRun: (state, action: PayloadAction<{ instructions: string; feedback: string; focusPaths: string[] }>) => {
      state.action = '';
      state.actionError = null;
      state.actionNotice = null;
      state.instructions = action.payload.instructions;
      state.draftFeedback = action.payload.feedback;
      state.draftFocusPaths = action.payload.focusPaths;
      state.scope = {};
      state.decisionNote = '';
      state.reviseFeedback = '';
      state.revertChanges = false;
      state.decisions = {};
      state.selectedPath = '';
      state.openExchangeId = '';
      state.templateTab = 'files';
      state.templateRepo = '';
      state.diffScope = 'pr';
    },
    setAction: (state, action: PayloadAction<{ action: AgentRunAction; error?: string | null; notice?: string | null }>) => {
      state.action = action.payload.action;
      state.actionError = action.payload.error ?? null;
      if (action.payload.notice !== undefined) state.actionNotice = action.payload.notice;
    },
    setInstructions: (state, action: PayloadAction<string>) => {
      state.instructions = action.payload;
    },
    setDraftFeedback: (state, action: PayloadAction<string>) => {
      state.draftFeedback = action.payload;
    },
    toggleDraftFocusPath: (state, action: PayloadAction<string>) => {
      state.draftFocusPaths = state.draftFocusPaths.includes(action.payload)
        ? state.draftFocusPaths.filter((path) => path !== action.payload)
        : [...state.draftFocusPaths, action.payload];
    },
    initScope: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((id) => {
        state.scope[id] ??= true;
      });
    },
    toggleScope: (state, action: PayloadAction<string>) => {
      state.scope[action.payload] = !state.scope[action.payload];
    },
    setDecisionNote: (state, action: PayloadAction<string>) => {
      state.decisionNote = action.payload;
    },
    setReviseFeedback: (state, action: PayloadAction<string>) => {
      state.reviseFeedback = action.payload;
    },
    setRevertChanges: (state, action: PayloadAction<boolean>) => {
      state.revertChanges = action.payload;
    },
    initDecisions: (state, action: PayloadAction<Array<{ id: string; after: unknown }>>) => {
      action.payload.forEach((item) => {
        state.decisions[item.id] ??= { action: '', afterText: JSON.stringify(item.after ?? {}, null, 2), editing: false };
      });
    },
    setDecision: (state, action: PayloadAction<{ id: string; patch: Partial<DecisionDraft> }>) => {
      const current = state.decisions[action.payload.id] ?? { action: '', afterText: '{}', editing: false };
      state.decisions[action.payload.id] = { ...current, ...action.payload.patch };
    },
    selectPath: (state, action: PayloadAction<string>) => {
      state.selectedPath = action.payload;
    },
    setOpenExchange: (state, action: PayloadAction<string>) => {
      state.openExchangeId = action.payload;
    },
    setTemplateTab: (state, action: PayloadAction<AgentRunsBuilderState['templateTab']>) => {
      state.templateTab = action.payload;
    },
    setTemplateRepo: (state, action: PayloadAction<string>) => {
      state.templateRepo = action.payload;
      state.selectedPath = '';
    },
    setDiffScope: (state, action: PayloadAction<'pr' | 'run'>) => {
      state.diffScope = action.payload;
    },
    setView: (state, action: PayloadAction<{ status: Status; error?: string | null }>) => {
      state.viewStatus = action.payload.status;
      state.viewError = action.payload.error ?? null;
    },
    openUpdatePr: (state, action: PayloadAction<string>) => {
      state.updatePr = { open: true, deliveryId: action.payload, feedback: '', focusPaths: [], status: 'idle', error: null };
    },
    closeUpdatePr: (state) => {
      state.updatePr = initialState.updatePr;
    },
    setUpdatePrFeedback: (state, action: PayloadAction<string>) => {
      state.updatePr.feedback = action.payload;
    },
    toggleUpdatePrFocusPath: (state, action: PayloadAction<string>) => {
      const paths = state.updatePr.focusPaths;
      state.updatePr.focusPaths = paths.includes(action.payload) ? paths.filter((path) => path !== action.payload) : [...paths, action.payload];
    },
    setUpdatePrStatus: (state, action: PayloadAction<{ status: Status; error?: string | null }>) => {
      state.updatePr.status = action.payload.status;
      state.updatePr.error = action.payload.error ?? null;
    },
    setHistory: (state, action: PayloadAction<{ status: Status; error?: string | null }>) => {
      state.historyStatus = action.payload.status;
      state.historyError = action.payload.error ?? null;
    },
    reset: () => initialState,
  },
});

export const AgentRunsBuilderActions = agentRunsBuilderSlice.actions;
export const agentRunsBuilderReducer = agentRunsBuilderSlice.reducer;
