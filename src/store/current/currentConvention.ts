import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Convention } from '@/model/convention';

/** The convention open on the detail page / in the form modal, plus its repo roles. */
export type CurrentConventionState = Convention & { role_keys: string[] };

export const EMPTY_CURRENT_CONVENTION: CurrentConventionState = {
  id: '',
  key: '',
  domain_key: 'data_model',
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
  role_keys: ['storage'],
};

export const currentConventionSlice = createSlice({
  name: 'currentConvention',
  initialState: EMPTY_CURRENT_CONVENTION,
  reducers: {
    setConvention: (_state, action: PayloadAction<CurrentConventionState>) => action.payload,
    updateFields: (state, action: PayloadAction<Partial<CurrentConventionState>>) => ({
      ...state,
      ...action.payload,
    }),
    toggleRole: (state, action: PayloadAction<string>) => {
      const role = action.payload;
      state.role_keys = state.role_keys.includes(role)
        ? state.role_keys.filter((key) => key !== role)
        : [...state.role_keys, role];
    },
    reset: () => EMPTY_CURRENT_CONVENTION,
  },
});

export const CurrentConventionActions = currentConventionSlice.actions;
export const currentConventionReducer = currentConventionSlice.reducer;
