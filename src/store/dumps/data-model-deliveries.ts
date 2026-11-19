import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DeliveryTarget } from '@/api/data-model-deliveries';
import type { DataModelDelivery } from '@/model/data-model-delivery';

/** Delivery targets (storage, express, web) keyed by deliveryTargetsKey(proposalId, kind). */
type DataModelDeliveriesState = Record<string, DeliveryTarget[]>;

const initialState: DataModelDeliveriesState = {};

export const dataModelDeliveriesSlice = createSlice({
  name: 'dataModelDeliveries',
  initialState,
  reducers: {
    setTargetsForProposal: (state, action: PayloadAction<{ key: string; targets: DeliveryTarget[] }>) => {
      state[action.payload.key] = action.payload.targets;
    },
    mergeTargetsForProposal: (state, action: PayloadAction<{ key: string; targets: DeliveryTarget[] }>) => {
      const current = state[action.payload.key] ?? [];
      const byRole = new Map(current.map((target) => [target.role, target]));
      action.payload.targets.forEach((target) => byRole.set(target.role, target));
      state[action.payload.key] = Array.from(byRole.values());
    },
    upsertDelivery: (state, action: PayloadAction<DataModelDelivery>) => {
      const targets = state[deliveryTargetsKey(action.payload.proposal_id, action.payload.kind ?? 'model')];
      const target = targets?.find((item) => item.role === action.payload.role);
      if (target) target.delivery = action.payload;
    },
    reset: () => initialState,
  },
});

/** Dump key for one proposal's deliveries of one kind. */
export const deliveryTargetsKey = (proposalId: string, kind: string): string => `${proposalId}:${kind}`;

export const DataModelDeliveriesActions = dataModelDeliveriesSlice.actions;
export const dataModelDeliveriesReducer = dataModelDeliveriesSlice.reducer;
