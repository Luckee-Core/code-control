import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CustomerOpsSyncComparePayload } from '@/api/customer-ops-sync/types';

export type CustomerOpsSyncDraftDecision = {
  action: 'link' | 'create';
  opsCustomerId?: string;
};

type CustomerOpsSyncBuilderState = {
  isModalOpen: boolean;
  compareLoading: boolean;
  applyLoading: boolean;
  compareError: string | null;
  applyError: string | null;
  comparePayload: CustomerOpsSyncComparePayload | null;
  draftDecisions: Record<string, CustomerOpsSyncDraftDecision>;
};

const initialState: CustomerOpsSyncBuilderState = {
  isModalOpen: false,
  compareLoading: false,
  applyLoading: false,
  compareError: null,
  applyError: null,
  comparePayload: null,
  draftDecisions: {},
};

const customerOpsSyncBuilderSlice = createSlice({
  name: 'customerOpsSyncBuilder',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
      state.compareError = null;
      state.applyError = null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.comparePayload = null;
      state.draftDecisions = {};
      state.compareLoading = false;
      state.applyLoading = false;
    },
    setCompareLoading: (state, action: PayloadAction<boolean>) => {
      state.compareLoading = action.payload;
    },
    setApplyLoading: (state, action: PayloadAction<boolean>) => {
      state.applyLoading = action.payload;
    },
    setCompareError: (state, action: PayloadAction<string | null>) => {
      state.compareError = action.payload;
    },
    setApplyError: (state, action: PayloadAction<string | null>) => {
      state.applyError = action.payload;
    },
    setComparePayload: (state, action: PayloadAction<CustomerOpsSyncComparePayload | null>) => {
      state.comparePayload = action.payload;
    },
    setDraftDecisions: (state, action: PayloadAction<Record<string, CustomerOpsSyncDraftDecision>>) => {
      state.draftDecisions = action.payload;
    },
    setDraftDecision: (
      state,
      action: PayloadAction<{ localCustomerId: string; decision: CustomerOpsSyncDraftDecision }>,
    ) => {
      state.draftDecisions[action.payload.localCustomerId] = action.payload.decision;
    },
    reset: () => initialState,
  },
});

export const CustomerOpsSyncBuilderActions = customerOpsSyncBuilderSlice.actions;
export const customerOpsSyncBuilderReducer = customerOpsSyncBuilderSlice.reducer;
