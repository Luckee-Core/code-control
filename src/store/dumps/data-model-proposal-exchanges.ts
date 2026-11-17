import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DataModelProposalAiExchangeSummary } from '@/model/data-model-proposal-ai-exchange';

/** AI call summaries keyed by proposal id. */
type DataModelProposalExchangesState = Record<string, DataModelProposalAiExchangeSummary[]>;

const initialState: DataModelProposalExchangesState = {};

export const dataModelProposalExchangesSlice = createSlice({
  name: 'dataModelProposalExchanges',
  initialState,
  reducers: {
    setExchangesForProposal: (
      state,
      action: PayloadAction<{ proposalId: string; exchanges: DataModelProposalAiExchangeSummary[] }>,
    ) => {
      state[action.payload.proposalId] = action.payload.exchanges;
    },
    reset: () => initialState,
  },
});

export const DataModelProposalExchangesActions = dataModelProposalExchangesSlice.actions;
export const dataModelProposalExchangesReducer = dataModelProposalExchangesSlice.reducer;
