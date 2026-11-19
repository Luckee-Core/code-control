import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DeliveryTarget } from '@/api/data-model-deliveries';
import type { DataModelDelivery } from '@/model/data-model-delivery';

/** Delivery targets (storage, express, web) keyed by proposal id. */
type DataModelDeliveriesState = Record<string, DeliveryTarget[]>;

const initialState: DataModelDeliveriesState = {};

export const dataModelDeliveriesSlice = createSlice({
  name: 'dataModelDeliveries',
  initialState,
  reducers: {
    setTargetsForProposal: (state, action: PayloadAction<{ proposalId: string; targets: DeliveryTarget[] }>) => {
      state[action.payload.proposalId] = action.payload.targets;
    },
    mergeTargetsForProposal: (state, action: PayloadAction<{ proposalId: string; targets: DeliveryTarget[] }>) => {
      const current = state[action.payload.proposalId] ?? [];
      const byRole = new Map(current.map((target) => [target.role, target]));
      action.payload.targets.forEach((target) => byRole.set(target.role, target));
      state[action.payload.proposalId] = Array.from(byRole.values());
    },
    upsertDelivery: (state, action: PayloadAction<DataModelDelivery>) => {
      const targets = state[action.payload.proposal_id];
      const target = targets?.find((item) => item.role === action.payload.role);
      if (target) target.delivery = action.payload;
    },
    reset: () => initialState,
  },
});

export const DataModelDeliveriesActions = dataModelDeliveriesSlice.actions;
export const dataModelDeliveriesReducer = dataModelDeliveriesSlice.reducer;
