import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Convention } from '@/model/convention';
import type { ConventionExample } from '@/model/convention-example';
import type { ConventionSource } from '@/model/convention-source';
import type { ConventionDetail } from '@/model/convention-responses';

type CurrentConventionState = {
  convention: Convention;
  roleKeys: string[];
  examples: ConventionExample[];
  sources: ConventionSource[];
};

const emptyConvention: Convention = {
  id: '',
  key: '',
  domain_key: '',
  topic_key: '',
  title: '',
  statement: '',
  rationale: '',
  severity: 'must',
  status: 'draft',
  check_kind: 'none',
  check_config: null,
  sort_order: 0,
  created_at: '',
  updated_at: '',
};

const initialState: CurrentConventionState = {
  convention: emptyConvention,
  roleKeys: [],
  examples: [],
  sources: [],
};

export const currentConventionSlice = createSlice({
  name: 'currentConvention',
  initialState,
  reducers: {
    setConvention: (state, action: PayloadAction<Convention>) => {
      if (state.convention.id !== action.payload.id) {
        return { ...initialState, convention: action.payload };
      }
      state.convention = action.payload;
    },
    setDetail: (_state, action: PayloadAction<ConventionDetail>) => ({
      convention: action.payload.convention,
      roleKeys: action.payload.roles.map((role) => role.role_key),
      examples: action.payload.examples,
      sources: action.payload.sources,
    }),
    updateConventionFields: (state, action: PayloadAction<Partial<Convention>>) => {
      state.convention = { ...state.convention, ...action.payload };
    },
    toggleRoleKey: (state, action: PayloadAction<string>) => {
      state.roleKeys = state.roleKeys.includes(action.payload)
        ? state.roleKeys.filter((key) => key !== action.payload)
        : [...state.roleKeys, action.payload].sort();
    },
    setRoleKeys: (state, action: PayloadAction<string[]>) => {
      state.roleKeys = action.payload;
    },
    addExample: (state, action: PayloadAction<ConventionExample>) => {
      state.examples.push(action.payload);
    },
    removeExample: (state, action: PayloadAction<string>) => {
      state.examples = state.examples.filter((example) => example.id !== action.payload);
    },
    addSource: (state, action: PayloadAction<ConventionSource>) => {
      state.sources.push(action.payload);
    },
    removeSource: (state, action: PayloadAction<string>) => {
      state.sources = state.sources.filter((source) => source.id !== action.payload);
    },
    reset: () => initialState,
  },
});

export const CurrentConventionActions = currentConventionSlice.actions;
export const currentConventionReducer = currentConventionSlice.reducer;
