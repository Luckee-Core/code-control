import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Customer } from '@/model/customer';

const initialState: Customer = {
  id: '',
  user_id: null,
  name: '',
  status: 'pending_review',
  company: null,
  email: null,
  phone: null,
  address_line1: null,
  address_line2: null,
  city: null,
  state: null,
  postal_code: null,
  facebook_url: null,
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
export const currentCustomerReducer = currentCustomerSlice.reducer;
