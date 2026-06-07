import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Customer } from '@/model/customer';

const initialState: Customer = {
  id: '',
  name: '',
  description: null,
  stage: 'discovery_call',
  created_at: '',
  updated_at: '',
};

export const currentCustomerSlice = createSlice({
  name: 'currentCustomer',
  initialState,
  reducers: {
    setCustomer: (_state, action: PayloadAction<Customer>) => action.payload,
    updateCustomerFields: (state, action: PayloadAction<Partial<Customer>>) => {
      return { ...state, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const CurrentCustomerActions = currentCustomerSlice.actions;
export default currentCustomerSlice.reducer;
