import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TemplateHead } from '@/api/agent-runs';

/** Each template repo's current default-branch commit, keyed by repo role. */
type TemplateHeadsState = Record<string, TemplateHead>;

const initialState: TemplateHeadsState = {};

export const templateHeadsSlice = createSlice({
  name: 'templateHeads',
  initialState,
  reducers: {
    setHeads: (_state, action: PayloadAction<TemplateHead[]>) => Object.fromEntries(action.payload.map((head) => [head.role_key, head])),
    reset: () => initialState,
  },
});

export const TemplateHeadsActions = templateHeadsSlice.actions;
export const templateHeadsReducer = templateHeadsSlice.reducer;
