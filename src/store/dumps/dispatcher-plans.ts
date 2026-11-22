import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DispatcherPlan } from '@/model/dispatcher-plan';

/** Dispatcher plan per software system id (absent = not loaded yet). */
type DispatcherPlansState = Record<string, DispatcherPlan>;

const initialState: DispatcherPlansState = {};

export const dispatcherPlansSlice = createSlice({
  name: 'dispatcherPlans',
  initialState,
  reducers: {
    setForSoftwareSystem: (state, action: PayloadAction<{ softwareSystemId: string; plan: DispatcherPlan }>) => {
      state[action.payload.softwareSystemId] = action.payload.plan;
    },
    reset: () => initialState,
  },
});

export const DispatcherPlansActions = dispatcherPlansSlice.actions;
export const dispatcherPlansReducer = dispatcherPlansSlice.reducer;
