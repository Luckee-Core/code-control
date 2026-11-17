import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DataModelProposal } from '@/model/data-model-proposal';

/** Proposals of the current software system, keyed by id. */
type DataModelProposalsState = Record<string, DataModelProposal>;

const initialState: DataModelProposalsState = {};

export const dataModelProposalsSlice = createSlice({
  name: 'dataModelProposals',
  initialState,
  reducers: {
    setDataModelProposals: (_state, action: PayloadAction<DataModelProposal[]>) => {
      const next: DataModelProposalsState = {};
      action.payload.forEach((proposal) => {
        next[proposal.id] = proposal;
      });
      return next;
    },
    upsertDataModelProposal: (state, action: PayloadAction<DataModelProposal>) => {
      state[action.payload.id] = action.payload;
    },
    deleteDataModelProposal: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const DataModelProposalsActions = dataModelProposalsSlice.actions;
export const dataModelProposalsReducer = dataModelProposalsSlice.reducer;
